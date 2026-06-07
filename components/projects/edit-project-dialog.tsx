"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { updateProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditProjectDialogProps {
  project: {
    id: string;
    name: string;
    clientName: string;
    location?: string | null;
    contractValue?: any; // Decimal or number
    mode: string;
    status: string;
    notes?: string | null;
    startDate?: Date | string | null;
    estimatedEndDate?: Date | string | null;
  };
}

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Controlled state for Radix Select (doesn't submit to FormData natively)
  const [mode, setMode] = useState<string>(project.mode);
  const [status, setStatus] = useState<string>(project.status);

  // Format contract value for initial display
  const initialValueRaw = project.contractValue ? String(Math.round(Number(project.contractValue))) : "";
  const initialValueFormatted = project.contractValue
    ? new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(Number(project.contractValue))
    : "";

  const [contractValueRaw, setContractValueRaw] = useState(initialValueRaw);
  const [contractValueFormatted, setContractValueFormatted] = useState(initialValueFormatted);
  const router = useRouter();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    setContractValueRaw(value);
    
    if (value) {
      setContractValueFormatted(
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(value))
      );
    } else {
      setContractValueFormatted("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const startDateString = formData.get("startDate") as string;
    const estimatedEndDateString = formData.get("estimatedEndDate") as string;

    const data = {
      name: (formData.get("name") as string)?.trim(),
      clientName: (formData.get("clientName") as string)?.trim(),
      location: (formData.get("location") as string)?.trim() || undefined,
      notes: (formData.get("notes") as string)?.trim() || undefined,
      // Gunakan state — Radix Select tidak auto-submit ke FormData
      mode: mode as "CONSULTATION" | "FULL_CONTRACTOR",
      status: status as "ACTIVE" | "COMPLETED" | "PENDING" | "CANCELLED",
      contractValue: contractValueRaw ? Number(contractValueRaw) : undefined,
      startDate: startDateString ? new Date(startDateString) : undefined,
      estimatedEndDate: estimatedEndDateString ? new Date(estimatedEndDateString) : undefined,
    };

    try {
      const result = await updateProject(project.id, data);
      
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Proyek berhasil diperbarui!");
        setOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error("Unexpected error updating project:", err);
      toast.error("Terjadi kesalahan tidak terduga. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely format Date to YYYY-MM-DD
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return "";
    try {
      const date = new Date(dateVal);
      return date.toISOString().split("T")[0];
    } catch (e) {
      return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="rounded-none h-8 px-2 border-gray-200 hover:bg-gray-50 hover:text-[#1A2530]" />}>
        <Pencil className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-none border-none bg-white/90 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground text-center mb-4">
            Edit Proyek
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Nama Proyek</Label>
              <Input id="name" name="name" defaultValue={project.name} required className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Contoh: Ruka House" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-foreground font-medium">Nama Klien</Label>
              <Input id="clientName" name="clientName" defaultValue={project.clientName} required className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Contoh: Bpk. Budi" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mode" className="text-foreground font-medium">Mode Proyek</Label>
              <Select value={mode} onValueChange={(val) => val && setMode(val)}>
                <SelectTrigger className="rounded-none bg-secondary/50 border-transparent focus:ring-primary">
                  <SelectValue placeholder="Pilih mode" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="CONSULTATION">Konsultasi &amp; Desain</SelectItem>
                  <SelectItem value="FULL_CONTRACTOR">Full Kontraktor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-foreground font-medium">Status Proyek</Label>
              <Select value={status} onValueChange={(val) => val && setStatus(val)}>
                <SelectTrigger className="rounded-none bg-secondary/50 border-transparent focus:ring-primary">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="ACTIVE">Aktif (Berjalan)</SelectItem>
                  <SelectItem value="COMPLETED">Selesai</SelectItem>
                  <SelectItem value="PENDING">Tertunda</SelectItem>
                  <SelectItem value="CANCELLED">Batal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contractValueFormatted" className="text-foreground font-medium">Nilai Kontrak</Label>
            <Input 
              id="contractValueFormatted" 
              value={contractValueFormatted}
              onChange={handleCurrencyChange}
              className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary font-mono" 
              placeholder="Rp 0" 
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-foreground font-medium">Tanggal Mulai</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="date"
                defaultValue={formatDateForInput(project.startDate)}
                className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedEndDate" className="text-foreground font-medium">Estimasi Selesai</Label>
              <Input 
                id="estimatedEndDate" 
                name="estimatedEndDate" 
                type="date"
                defaultValue={formatDateForInput(project.estimatedEndDate)}
                className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-foreground font-medium">Lokasi</Label>
            <Input id="location" name="location" defaultValue={project.location || ""} className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Kota atau alamat proyek" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-foreground font-medium">Catatan</Label>
            <Textarea id="notes" name="notes" defaultValue={project.notes || ""} rows={3} className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary resize-none" placeholder="Catatan tambahan..." />
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-none bg-primary hover:bg-primary/90 text-white font-medium shadow-none h-12 text-md mt-4">
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
