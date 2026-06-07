"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProject } from "@/app/actions/projects";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface CreateProjectDialogProps {
  triggerClassName?: string;
  buttonText?: string;
}

export function CreateProjectDialog({ triggerClassName, buttonText = "Tambah Proyek" }: CreateProjectDialogProps = {}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contractValueRaw, setContractValueRaw] = useState("");
  const [contractValueFormatted, setContractValueFormatted] = useState("");
  const [mode, setMode] = useState<string>("CONSULTATION");
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
    const data = {
      name: formData.get("name") as string,
      clientName: formData.get("clientName") as string,
      mode: mode as "CONSULTATION" | "FULL_CONTRACTOR",
      contractValue: contractValueRaw ? Number(contractValueRaw) : undefined,
    };

    const result = await createProject(data);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Proyek berhasil dibuat!");
      setOpen(false);
      router.refresh();
      // Reset form state
      setContractValueRaw("");
      setContractValueFormatted("");
      setMode("CONSULTATION");
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className={triggerClassName || "rounded-none bg-primary hover:bg-primary/90 text-white shadow-none font-medium px-6"} />}>
        <Plus className="mr-2 h-4 w-4" /> {buttonText}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none border-none bg-white/80 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground text-center mb-4">
            Proyek Baru
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium">Nama Proyek</Label>
            <Input id="name" name="name" required className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Contoh: Ruka House" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-foreground font-medium">Nama Klien</Label>
            <Input id="clientName" name="clientName" required className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary" placeholder="Contoh: Bpk. Budi" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode" className="text-foreground font-medium">Mode Proyek</Label>
            <Select value={mode} onValueChange={(val) => val && setMode(val)} required>
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
            <Label htmlFor="contractValue" className="text-foreground font-medium">Nilai Kontrak (Opsional)</Label>
            <Input 
              id="contractValueFormatted" 
              value={contractValueFormatted}
              onChange={handleCurrencyChange}
              className="rounded-none bg-secondary/50 border-transparent focus-visible:ring-primary font-mono" 
              placeholder="Rp 0" 
            />
            {/* Hidden field for actual raw value */}
            <input type="hidden" name="contractValue" value={contractValueRaw} />
          </div>

          <Button type="submit" disabled={loading} className="w-full rounded-none bg-primary hover:bg-primary/90 text-white font-medium shadow-none h-12 text-md mt-4">
            {loading ? "Menyimpan..." : "Simpan Proyek"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
