"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Receipt, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteExpense } from "@/app/actions/expenses";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export function ExpenseList({ expenses, projectId }: { expenses: any[]; projectId: string }) {
  const router = useRouter();

  const handleDelete = async (expenseId: string) => {
    if (!confirm("Hapus pengeluaran ini?")) return;
    
    const result = await deleteExpense(expenseId, projectId);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pengeluaran dihapus");
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
      {expenses.map((expense) => (
        <div key={expense.id} className="bg-white rounded-none p-5 md:p-6 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-none bg-red-50 flex items-center justify-center shrink-0">
              <Receipt className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-foreground text-lg">{expense.description}</h4>
                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500 border-slate-200">
                  {expense.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(new Date(expense.expenseDate), "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="text-left md:text-right">
              <p className="text-sm font-medium text-muted-foreground">Nominal</p>
              <p className="font-bold text-foreground text-lg">
                {formatCurrency(Number(expense.amount))}
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(expense.id)}
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
