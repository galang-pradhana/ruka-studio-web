import { getDashboardStats } from "@/app/actions/dashboard";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { ScrollChoreography } from "@/components/ui/scroll-choreography"; // Or normal animation
import { FolderKanban, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const result = await getDashboardStats();
  
  // Default values if fetching fails
  const stats = result.data || {
    activeProjects: 0,
    totalProjects: 0,
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-10">
        <h1 className="text-[40px] font-bold tracking-tight leading-tight text-foreground">Dashboard</h1>
        <p className="text-[17px] text-muted-foreground mt-1 tracking-tight">
          Ringkasan finansial dan operasional Ruka Studio.
        </p>
      </div>

      <DashboardStats />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-none p-8 border border-border shadow-sm">
          <h3 className="font-bold text-lg mb-6 tracking-tight">Ringkasan Arus Kas</h3>
          <div className="flex flex-col space-y-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-muted-foreground">Pemasukan</span>
                <span className="text-emerald-600 font-bold">
                  Rp {(stats.totalIncome / 1000000).toFixed(1)} Jt
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-none h-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-none transition-all duration-1000" 
                  style={{ width: stats.totalIncome > 0 ? '100%' : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-muted-foreground">Pengeluaran</span>
                <span className="text-rose-500 font-bold">
                  Rp {(stats.totalExpense / 1000000).toFixed(1)} Jt
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-none h-3 overflow-hidden">
                <div 
                  className="bg-rose-500 h-full rounded-none transition-all duration-1000 delay-300" 
                  style={{ 
                    width: stats.totalIncome > 0 
                      ? `${Math.min((stats.totalExpense / stats.totalIncome) * 100, 100)}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
            
            <div className="pt-4 mt-2 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-foreground">Profit Bersih</span>
                <span className="text-xl font-bold text-primary">
                  {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(stats.netProfit)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-none p-8 border border-primary/10 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-white rounded-none flex items-center justify-center shadow-sm mb-6">
            <FolderKanban className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-5xl font-bold tracking-tighter text-foreground mb-2">
            {stats.activeProjects}
          </h2>
          <p className="text-muted-foreground font-medium">Proyek Sedang Berjalan</p>
          <div className="mt-8 px-6 py-3 bg-white rounded-none text-sm font-semibold shadow-sm text-foreground">
            Total Histori: {stats.totalProjects} Proyek
          </div>
        </div>
      </div>
    </div>
  );
}
