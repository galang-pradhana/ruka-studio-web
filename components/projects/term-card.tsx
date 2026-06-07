"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateTermStatus } from "@/app/actions/terms";
import { toast } from "sonner";
import { CheckCircle2, Clock } from "lucide-react";

interface TermCardProps {
  term: {
    id: string;
    projectId: string;
    termName: string;
    percentage: any;
    amount: any;
    status: string;
    paidDate: Date | null;
  };
}

export function TermCard({ term }: TermCardProps) {
  const [loading, setLoading] = useState(false);
  const isPaid = term.status === "PAID";

  const handleToggleStatus = async () => {
    setLoading(true);
    const newStatus = isPaid ? "UNPAID" : "PAID";
    const result = await updateTermStatus(term.id, term.projectId, newStatus);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Termin ditandai sebagai ${newStatus}`);
    }
    setLoading(false);
  };

  const formattedAmount = new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    maximumFractionDigits: 0 
  }).format(Number(term.amount));

  return (
    <div className={`p-5 rounded-[24px] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all ${isPaid ? 'bg-secondary/30 border border-border/50' : 'bg-white shadow-sm'}`}>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-lg font-bold tracking-tight text-foreground">{term.termName}</h4>
          {term.percentage && (
            <Badge variant="outline" className="text-xs bg-secondary/50 rounded-full border-none">
              {Number(term.percentage)}%
            </Badge>
          )}
        </div>
        <p className="text-xl font-medium text-foreground mb-2">{formattedAmount}</p>
        
        {isPaid && term.paidDate ? (
          <div className="flex items-center text-sm text-green-600 font-medium">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Lunas pada {new Date(term.paidDate).toLocaleDateString('id-ID')}
          </div>
        ) : (
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-1.5" />
            Menunggu pembayaran
          </div>
        )}
      </div>

      <Button 
        onClick={handleToggleStatus} 
        disabled={loading}
        variant={isPaid ? "outline" : "default"}
        className={`rounded-full font-medium px-6 shadow-none ${isPaid ? 'bg-transparent hover:bg-secondary' : 'bg-primary hover:bg-primary/90 text-white'}`}
      >
        {loading ? "Memproses..." : isPaid ? "Batalkan Lunas" : "Tandai Lunas"}
      </Button>
    </div>
  );
}
