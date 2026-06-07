"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addExpense } from "@/app/actions/expenses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ExpenseCategory = "TRANSPORT" | "PRINT" | "SOFTWARE" | "MATERIAL" | "LABOR" | "EQUIPMENT" | "OTHER";

export function CreateExpenseDialog({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rawAmount, setRawAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("MATERIAL");

  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^,\d]/g, "").toString();
    if (!numberString) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(numberString));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberString = value.replace(/[^,\d]/g, "");
    setRawAmount(numberString);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;
    const expenseDate = formData.get("expenseDate") as string;

    if (!rawAmount || Number(rawAmount) <= 0) {
      toast.error("Nominal pengeluaran harus lebih dari 0");
      setLoading(false);
      return;
    }

    const data = {
      projectId,
      category, // Gunakan state, bukan formData.get() — Radix Select tidak submit ke FormData
      description,
      amount: Number(rawAmount),
      expenseDate: new Date(expenseDate).toISOString(),
    };

    try {
      const result = await addExpense(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Pengeluaran berhasil dicatat");
        setOpen(false);
        setRawAmount("");
        setCategory("MATERIAL");
        router.refresh();
      }
    } catch (err) {
      toast.error("Terjadi kesalahan tidak terduga.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="rounded-none" />}>
        <Plus className="w-4 h-4 mr-2" />
        Tambah Pengeluaran
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Catat Pengeluaran</DialogTitle>
            <DialogDescription>
              Tambahkan data pengeluaran operasional proyek ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as ExpenseCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MATERIAL">Material</SelectItem>
                  <SelectItem value="LABOR">Tenaga Kerja / Tukang</SelectItem>
                  <SelectItem value="TRANSPORT">Transportasi</SelectItem>
                  <SelectItem value="PRINT">Cetak / Print</SelectItem>
                  <SelectItem value="SOFTWARE">Software / Lisensi</SelectItem>
                  <SelectItem value="EQUIPMENT">Peralatan</SelectItem>
                  <SelectItem value="OTHER">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Misal: Pembelian semen 10 sak"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Nominal</Label>
              <Input
                id="amount"
                value={formatRupiah(rawAmount)}
                onChange={handleAmountChange}
                placeholder="Rp 0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseDate">Tanggal</Label>
              <Input
                id="expenseDate"
                name="expenseDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-none">
              {loading ? "Menyimpan..." : "Simpan Pengeluaran"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
