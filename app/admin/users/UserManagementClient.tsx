"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUserRole, toggleUserActive, resetUserPassword } from "@/app/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, ShieldCheck, UserCog, KeyRound, UserX, UserCheck } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: Date;
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  VIEWER: "Viewer",
};

const ROLE_BADGE_CLASSES: Record<string, string> = {
  OWNER: "bg-purple-50 text-purple-700 border-purple-100",
  ADMIN: "bg-blue-50 text-blue-700 border-blue-100",
  VIEWER: "bg-gray-50 text-gray-600 border-gray-100",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  OWNER: "Akses penuh: kelola user, proyek, pembukuan, dan konten.",
  ADMIN: "Kelola proyek dan pembukuan. Tidak bisa kelola user.",
  VIEWER: "Hanya bisa melihat data proyek dan laporan.",
};

export function UserManagementClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Create user form state
  const [newRole, setNewRole] = useState<string>("VIEWER");

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const result = await createUser({
        name: (formData.get("name") as string).trim(),
        email: (formData.get("email") as string).trim(),
        password: formData.get("password") as string,
        role: newRole as "OWNER" | "ADMIN" | "VIEWER",
      });

      if (result.error) {
        const msg = typeof result.error === "string" ? result.error : JSON.stringify(result.error);
        toast.error(msg);
      } else {
        toast.success(`User ${result.data?.name} berhasil dibuat. Password sementara harus diganti saat login pertama.`);
        setCreateOpen(false);
        setNewRole("VIEWER");
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const result = await updateUserRole(userId, role as "OWNER" | "ADMIN" | "VIEWER");
    if (result.error) toast.error(result.error);
    else {
      toast.success("Role berhasil diperbarui.");
      router.refresh();
    }
  };

  const handleToggleActive = async (userId: string, current: boolean) => {
    const result = await toggleUserActive(userId, !current);
    if (result.error) toast.error(result.error);
    else {
      toast.success(!current ? "User diaktifkan." : "User dinonaktifkan.");
      router.refresh();
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>, userId: string) => {
    e.preventDefault();
    setResetLoading(true);
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;

    try {
      const result = await resetUserPassword(userId, newPassword);
      if (result.error) toast.error(result.error);
      else {
        toast.success("Password berhasil direset. User wajib ganti password saat login.");
        setResetOpen(null);
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* RBAC Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(ROLE_DESCRIPTIONS).map(([role, desc]) => (
          <div key={role} className={`p-4 rounded-lg border ${ROLE_BADGE_CLASSES[role]} border-opacity-50`}>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-semibold text-sm">{ROLE_LABELS[role]}</span>
            </div>
            <p className="text-xs opacity-80">{desc}</p>
          </div>
        ))}
      </div>

      {/* Header with Add User */}
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogTrigger render={<Button className="rounded-none bg-[#1A2530] hover:bg-[#2C3E50] text-[#E8E1D5] px-5 py-2 h-10 inline-flex items-center text-sm shadow-none" />}>
            <Plus className="mr-2 h-4 w-4" /> Tambah User Baru
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Tambah User Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" name="name" required placeholder="Contoh: Budi Santoso" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="budi@rukastudio.id" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password Sementara</Label>
                <Input id="password" name="password" type="password" required placeholder="Min. 8 karakter" minLength={8} />
                <p className="text-xs text-gray-400">User wajib ganti password saat login pertama.</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newRole} onValueChange={(val) => val && setNewRole(val)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIEWER">Viewer — Hanya lihat</SelectItem>
                    <SelectItem value="ADMIN">Admin — Kelola proyek</SelectItem>
                    <SelectItem value="OWNER">Owner — Akses penuh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={createLoading} className="w-full bg-[#1A2530] hover:bg-[#2C3E50] text-white rounded-lg h-10">
                {createLoading ? "Membuat..." : "Buat User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50 border-b border-gray-200">
            <TableRow>
              <TableHead className="font-semibold text-gray-700 text-sm">Nama</TableHead>
              <TableHead className="font-semibold text-gray-700 text-sm">Email</TableHead>
              <TableHead className="font-semibold text-gray-700 text-sm">Role</TableHead>
              <TableHead className="font-semibold text-gray-700 text-sm text-center">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-sm">Dibuat</TableHead>
              <TableHead className="font-semibold text-gray-700 text-sm text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50/30 border-b border-gray-100 last:border-0">
                <TableCell className="align-middle">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1A2530] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {user.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-[#1A2530] text-[14px]">{user.name}</p>
                      {user.mustChangePassword && (
                        <p className="text-xs text-amber-500">⚠ Belum ganti password</p>
                      )}
                      {user.id === currentUserId && (
                        <p className="text-xs text-blue-500">• Akun Anda</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="align-middle text-gray-500 text-[13px]">{user.email}</TableCell>
                <TableCell className="align-middle">
                  {user.id === currentUserId ? (
                    <Badge className={`border text-xs ${ROLE_BADGE_CLASSES[user.role]}`}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  ) : (
                    <Select
                      value={user.role}
                      onValueChange={(val) => val && handleRoleChange(user.id, val)}
                    >
                      <SelectTrigger className="h-7 w-32 text-xs border-gray-200 rounded">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="OWNER">Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell className="align-middle text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded border ${
                    user.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-gray-100 text-gray-500 border-gray-200"
                  }`}>
                    {user.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </TableCell>
                <TableCell className="align-middle text-gray-400 text-[12px]">
                  {format(new Date(user.createdAt), "dd MMM yyyy", { locale: localeId })}
                </TableCell>
                <TableCell className="align-middle text-right space-x-1">
                  {user.id !== currentUserId && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-none h-7 px-2 border-gray-200 text-xs"
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        title={user.isActive ? "Nonaktifkan" : "Aktifkan"}
                      >
                        {user.isActive ? <UserX className="w-3.5 h-3.5 text-red-400" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
                      </Button>

                      {/* Reset Password Dialog */}
                      <Dialog open={resetOpen === user.id} onOpenChange={(o) => setResetOpen(o ? user.id : null)}>
                      <DialogTrigger render={<Button variant="outline" size="sm" className="rounded-none h-7 px-2 border-gray-200 text-xs" title="Reset Password" />}>
                          <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[360px] rounded-2xl">
                          <DialogHeader>
                            <DialogTitle>Reset Password — {user.name}</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={(e) => handleResetPassword(e, user.id)} className="space-y-4 mt-2">
                            <div className="space-y-2">
                              <Label htmlFor={`newPassword-${user.id}`}>Password Baru</Label>
                              <Input id={`newPassword-${user.id}`} name="newPassword" type="password" required placeholder="Min. 8 karakter" minLength={8} />
                              <p className="text-xs text-gray-400">User wajib ganti password ini saat login berikutnya.</p>
                            </div>
                            <Button type="submit" disabled={resetLoading} className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg h-9 text-sm">
                              {resetLoading ? "Mereset..." : "Reset Password"}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                  {user.id === currentUserId && (
                    <span className="text-xs text-gray-400 inline-flex items-center gap-1">
                      <UserCog className="w-3.5 h-3.5" /> Anda
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
