"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Trash2, 
  Eye, 
  Mail, 
  MessageSquare, 
  FileSpreadsheet, 
  Calendar,
  MapPin,
  Building2,
  Maximize2,
  DollarSign,
  Info
} from "lucide-react";
import { toast } from "sonner";
import { deleteProjectBrief } from "@/app/actions/brief.actions";

interface ProjectBrief {
  id: string;
  name: string;
  email: string;
  location: string;
  propType: string;
  landSize: string;
  budget: string;
  details: string | null;
  createdAt: Date;
}

interface BriefsManagementClientProps {
  initialBriefs: ProjectBrief[];
}

export function BriefsManagementClient({ initialBriefs }: BriefsManagementClientProps) {
  const [briefs, setBriefs] = useState<ProjectBrief[]>(initialBriefs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [briefToDelete, setBriefToDelete] = useState<ProjectBrief | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  // Format date helper
  const formatDate = (dateVal: any) => {
    if (!dateVal) return "-";
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Extract phone number helper
  const getWhatsAppLink = (contact: string) => {
    const cleanNum = contact.replace(/[^0-9+]/g, '');
    // Regex matches 628... or 08...
    const match = cleanNum.match(/(628|08)[0-9]{8,12}/);
    if (!match) return null;
    let phone = match[0];
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    return `https://wa.me/${phone}`;
  };

  // Extract email helper
  const getEmailAddress = (contact: string) => {
    const match = contact.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return match ? match[0] : null;
  };

  // Filter briefs based on search term
  const filteredBriefs = briefs.filter((brief) => {
    const term = searchTerm.toLowerCase();
    return (
      brief.name.toLowerCase().includes(term) ||
      brief.email.toLowerCase().includes(term) ||
      brief.location.toLowerCase().includes(term) ||
      brief.propType.toLowerCase().includes(term) ||
      (brief.details && brief.details.toLowerCase().includes(term))
    );
  });

  // Handle delete action
  const handleDelete = async () => {
    if (!briefToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await deleteProjectBrief(briefToDelete.id);
      if (res.success) {
        toast.success(`Brief dari "${briefToDelete.name}" berhasil dihapus.`);
        setBriefs(briefs.filter(b => b.id !== briefToDelete.id));
        setIsDeleteOpen(false);
        setBriefToDelete(null);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus brief.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan saat menghapus brief.");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle Export to CSV
  const handleExportCSV = () => {
    if (filteredBriefs.length === 0) {
      toast.error("Tidak ada data untuk diekspor.");
      return;
    }

    const headers = ["Tanggal Masuk", "Nama Klien", "Kontak/Email", "Lokasi Proyek", "Tipe Properti", "Luas Lahan", "Budget", "Deskripsi Kebutuhan"];
    const rows = filteredBriefs.map(b => [
      formatDate(b.createdAt),
      b.name,
      b.email,
      b.location,
      b.propType,
      b.landSize,
      b.budget,
      (b.details || "").replace(/"/g, '""').replace(/\n/g, ' ')
    ]);
    
    // Use proper escaping for non-ASCII characters
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Database_Brief_Klien_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Database brief berhasil diekspor ke CSV.");
  };

  return (
    <div className="space-y-4">
      {/* Search & Export Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Cari berdasarkan nama, email, lokasi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-none border-gray-200 focus-visible:ring-1 focus-visible:ring-[#1A2530]"
          />
        </div>
        <Button
          onClick={handleExportCSV}
          variant="outline"
          className="rounded-none border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          Ekspor CSV ({filteredBriefs.length})
        </Button>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50 border-b border-gray-200">
            <TableRow>
              <TableHead className="font-semibold text-gray-700 text-xs tracking-wider uppercase py-3">Tanggal Masuk</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs tracking-wider uppercase py-3">Nama Klien</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs tracking-wider uppercase py-3">Kontak / Email</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs tracking-wider uppercase py-3">Lokasi</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs tracking-wider uppercase py-3">Tipe</TableHead>
              <TableHead className="font-semibold text-gray-700 text-xs tracking-wider uppercase py-3 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBriefs.length > 0 ? (
              filteredBriefs.map((brief) => {
                const waLink = getWhatsAppLink(brief.email);
                const emailAddr = getEmailAddress(brief.email);

                return (
                  <TableRow key={brief.id} className="hover:bg-gray-50/30 border-b border-gray-100 last:border-0 transition-colors">
                    <TableCell className="align-middle text-gray-500 font-sans text-xs">
                      {formatDate(brief.createdAt)}
                    </TableCell>
                    <TableCell className="align-middle font-medium text-[#1A2530] text-[14px]">
                      {brief.name}
                    </TableCell>
                    <TableCell className="align-middle text-gray-600 text-xs font-sans">
                      <div className="flex flex-col gap-1 max-w-[200px] truncate">
                        <span>{brief.email}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          {waLink && (
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 font-semibold text-[10px]"
                            >
                              <MessageSquare className="w-3 h-3" /> WA
                            </a>
                          )}
                          {emailAddr && (
                            <a
                              href={`mailto:${emailAddr}`}
                              className="text-[#1B3B5A] hover:text-[#0B2240] inline-flex items-center gap-1 font-semibold text-[10px]"
                            >
                              <Mail className="w-3 h-3" /> Email
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="align-middle text-gray-600 text-[13px]">
                      {brief.location}
                    </TableCell>
                    <TableCell className="align-middle">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-sans font-medium">
                        {brief.propType}
                      </span>
                    </TableCell>
                    <TableCell className="align-middle text-right space-x-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBrief(brief);
                          setIsDetailsOpen(true);
                        }}
                        className="rounded-none h-8 px-2 border-gray-200 hover:bg-gray-50 hover:text-[#1A2530]"
                        title="Lihat Detail Brief"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setBriefToDelete(brief);
                          setIsDeleteOpen(true);
                        }}
                        className="rounded-none h-8 px-2 border-red-100 hover:bg-red-50 text-red-600 hover:text-red-700"
                        title="Hapus Brief"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-gray-500">
                  {searchTerm ? "Tidak ditemukan brief yang cocok." : "Belum ada brief klien yang masuk."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px] rounded-none border-none bg-white shadow-2xl p-0 overflow-hidden">
          {selectedBrief && (
            <>
              <div className="bg-[#1A2530] text-[#E8E1D5] px-6 py-5">
                <DialogTitle className="text-lg font-semibold tracking-wide" style={{ fontFamily: "var(--font-cinzel, serif)" }}>
                  Detail Brief Perencanaan Proyek
                </DialogTitle>
                <p className="text-xs text-[#E8E1D5]/70 mt-1">
                  Diterima pada {formatDate(selectedBrief.createdAt)}
                </p>
              </div>
              
              <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Client Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">Nama Klien</span>
                    <p className="text-sm font-semibold text-[#1A2530]">{selectedBrief.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">Kontak / Email</span>
                    <p className="text-sm font-medium text-gray-700 break-words">{selectedBrief.email}</p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Project Specs */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Lokasi</span>
                      <span className="text-xs font-semibold text-gray-700">{selectedBrief.location}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Tipe Properti</span>
                      <span className="text-xs font-semibold text-gray-700">{selectedBrief.propType}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Maximize2 className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Luas Lahan</span>
                      <span className="text-xs font-semibold text-gray-700">{selectedBrief.landSize}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono block">Estimasi Budget</span>
                      <span className="text-xs font-semibold text-gray-700">{selectedBrief.budget}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Spatial Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Info className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] uppercase tracking-wider font-mono">Deskripsi Ruang & Kebutuhan Khusus</span>
                  </div>
                  <div className="bg-gray-50/50 p-4 border border-gray-100">
                    <p className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {selectedBrief.details || "Tidak ada deskripsi tambahan yang diberikan."}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailsOpen(false)}
                  className="rounded-none border-gray-200 font-medium text-xs h-10 w-full sm:w-auto"
                >
                  Tutup
                </Button>
                {getWhatsAppLink(selectedBrief.email) && (
                  <a
                    href={getWhatsAppLink(selectedBrief.email) || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button className="rounded-none bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs h-10 w-full flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" /> Hubungi via WhatsApp
                    </Button>
                  </a>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-none border-none bg-white shadow-2xl p-6 sm:p-8">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold tracking-tight text-[#1A2530] text-center">
              Hapus Brief Klien?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 text-sm leading-relaxed">
              Apakah Anda yakin ingin menghapus brief dari <span className="font-semibold text-gray-700">"{briefToDelete?.name}"</span>? Tindakan ini akan menghapusnya dari database secara permanen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6 sm:mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={deleteLoading}
              className="w-full sm:w-1/2 rounded-none border-gray-200 hover:bg-gray-50 font-medium h-11"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={deleteLoading}
              className="w-full sm:w-1/2 rounded-none bg-red-600 hover:bg-red-700 text-white font-medium h-11 shadow-none"
            >
              {deleteLoading ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
