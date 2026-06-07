"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProjectTerm } from "@/app/actions/terms";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateTermDialogProps {
  projectId: string;
}

export function CreateTermDialog({ projectId }: CreateTermDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [amountRaw, setAmountRaw] = useState("");
  const [amountFormatted, setAmountFormatted] = useState("");
  const router = useRouter();

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // Only numbers
    setAmountRaw(value);
    
    if (value) {
      setAmountFormatted(
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(Number(value))
      );
    } else {
      setAmountFormatted("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      projectId,
      termName: formData.get("termName") as string,
      percentage: formData.get("percentage") ? Number(formData.get("percentage")) : undefined,
      amount: Number(amountRaw),
    };

    if (!data.amount || data.amount <= 0) {
      toast.error("Jumlah harus lebih dari 0");
      setLoading(false);
      return;
    }

    const result = await addProjectTerm(data);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Termin berhasil ditambahkan!");
      setOpen(false);
      router.refresh();
      // Reset form state
      setAmountRaw("");
      setAmountFormatted("");
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="rounded-full font-medium px-4 bg-white border-border hover:bg-secondary" />}>
        <Plus className="mr-2 h-4 w-4" /> Tambah Termin
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[28px] border-none bg-white/80 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground text-center mb-4">
            Termin Pembayaran Baru
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="termName" className="text-foreground font-medium">Nama Termin</Label>
            <Input id="termName" name="termName" required className="rounded-[12px] bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Contoh: DP 30% atau Termin 1" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="percentage" className="text-foreground font-medium">Persentase (%) (Opsional)</Label>
            <Input id="percentage" name="percentage" type="number" min="0" max="100" step="0.01" className="rounded-[12px] bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Contoh: 30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amountFormatted" className="text-foreground font-medium">Jumlah Pembayaran</Label>
            <Input 
              id="amountFormatted" 
              value={amountFormatted}
              onChange={handleCurrencyChange}
              required
              className="rounded-[12px] bg-secondary/50 border-transparent focus-visible:ring-primary font-mono" 
              placeholder="Rp 0" 
            />
            {/* Hidden field for actual raw value */}
            <input type="hidden" name="amount" value={amountRaw} />
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary/90 text-white font-medium shadow-none h-12 text-md mt-4">
            {loading ? "Menyimpan..." : "Simpan Termin"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
