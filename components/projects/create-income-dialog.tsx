"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addIncome } from "@/app/actions/incomes";
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

export function CreateIncomeDialog({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rawAmount, setRawAmount] = useState("");

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
    const incomeDate = formData.get("incomeDate") as string;

    if (!rawAmount || Number(rawAmount) <= 0) {
      toast.error("Nominal pemasukan harus lebih dari 0");
      setLoading(false);
      return;
    }

    const data = {
      projectId,
      description,
      amount: Number(rawAmount),
      incomeDate: new Date(incomeDate).toISOString(),
    };

    try {
      const result = await addIncome(data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Pemasukan berhasil dicatat");
        setOpen(false);
        setRawAmount("");
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
        Tambah Pemasukan
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Catat Pemasukan Ekstra</DialogTitle>
            <DialogDescription>
              Tambahkan pemasukan proyek di luar termin pembayaran utama.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Misal: Penambahan pekerjaan atap"
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
              <Label htmlFor="incomeDate">Tanggal</Label>
              <Input
                id="incomeDate"
                name="incomeDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full rounded-none bg-emerald-500 hover:bg-emerald-600 text-white">
              {loading ? "Menyimpan..." : "Simpan Pemasukan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
