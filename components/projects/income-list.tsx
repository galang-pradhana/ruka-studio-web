"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Banknote, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteIncome } from "@/app/actions/incomes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function IncomeList({ incomes, projectId }: { incomes: any[]; projectId: string }) {
  const router = useRouter();

  const handleDelete = async (incomeId: string) => {
    if (!confirm("Hapus pemasukan ini?")) return;
    
    const result = await deleteIncome(incomeId, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pemasukan dihapus");
      router.refresh();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {incomes.map((income) => (
        <div key={income.id} className="bg-white rounded-none p-5 md:p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-none bg-emerald-50 flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-foreground text-lg mb-1">{income.description}</h4>
              <p className="text-sm text-muted-foreground">
                {format(new Date(income.incomeDate), "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-left md:text-right">
              <p className="text-sm font-medium text-emerald-600">Nominal</p>
              <p className="font-bold text-foreground text-lg">
                +{formatCurrency(Number(income.amount))}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(income.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-none"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
