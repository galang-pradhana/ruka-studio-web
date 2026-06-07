"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
}

export function DeleteProjectButton({ projectId, projectName }: DeleteProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteProject(projectId);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Proyek "${projectName}" berhasil dihapus.`);
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="rounded-none h-8 px-2 border-red-100 hover:bg-red-50 text-red-600 hover:text-red-700" />}>
        <Trash2 className="w-4 h-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] rounded-[24px] border-none bg-white shadow-2xl p-6 sm:p-8">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-bold tracking-tight text-[#1A2530] text-center">
            Hapus Proyek?
          </DialogTitle>
          <DialogDescription className="text-center text-gray-500 text-sm leading-relaxed">
            Apakah Anda yakin ingin menghapus proyek <span className="font-semibold text-gray-700">"{projectName}"</span>? Tindakan ini akan menghapus semua termin pembayaran, pemasukan, dan pengeluaran terkait secara permanen dan tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6 sm:mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="w-full sm:w-1/2 rounded-full border-gray-200 hover:bg-gray-50 font-medium h-11"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-1/2 rounded-full bg-red-600 hover:bg-red-700 text-white font-medium h-11 shadow-none"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
