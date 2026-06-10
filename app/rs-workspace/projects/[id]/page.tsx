import { getProjectById } from "@/app/actions/projects";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { ArrowLeft, Briefcase, Wallet, Receipt, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Components
import { TermCard } from "@/components/projects/term-card";
import { IncomeList } from "@/components/projects/income-list";
import { ExpenseList } from "@/components/projects/expense-list";
import { CreateTermDialog } from "@/components/projects/create-term-dialog";
import { CreateIncomeDialog } from "@/components/projects/create-income-dialog";
import { CreateExpenseDialog } from "@/components/projects/create-expense-dialog";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getProjectById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const project = result.data;

  // Calculators
  const totalIncome = project.incomes.reduce((sum, current) => sum + Number(current.amount), 0);
  const totalExpense = project.expenses.reduce((sum, current) => sum + Number(current.amount), 0);
  const netProfit = totalIncome - totalExpense;
  const margin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  
  const totalPaidTerms = project.terms.filter(t => t.status === "PAID").reduce((sum, current) => sum + Number(current.amount), 0);
  const totalTermAmount = project.terms.reduce((sum, current) => sum + Number(current.amount), 0);
  const termProgress = totalTermAmount > 0 ? (totalPaidTerms / totalTermAmount) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link href="/rs-workspace/projects" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Proyek
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
            <Badge variant="outline" className={project.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}>
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Klien: <span className="font-medium text-foreground">{project.clientName}</span> • Lokasi: {project.location}
          </p>
        </div>
        <div className="bg-white px-6 py-4 rounded-none border border-border shadow-sm">
          <p className="text-sm text-muted-foreground font-medium mb-1">Nilai Kontrak</p>
          <p className="text-2xl font-bold text-primary">{formatCurrency(Number(project.contractValue))}</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start h-auto p-1 bg-white border border-border rounded-none mb-6">
          <TabsTrigger value="overview" className="rounded-none px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
            Ringkasan
          </TabsTrigger>
          <TabsTrigger value="terms" className="rounded-none px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
            Termin Pembayaran
          </TabsTrigger>
          <TabsTrigger value="incomes" className="rounded-none px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
            Pemasukan
          </TabsTrigger>
          <TabsTrigger value="expenses" className="rounded-none px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white">
            Pengeluaran
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="rounded-none shadow-sm border-emerald-100 bg-emerald-50/30">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-emerald-700">Total Pemasukan</CardTitle>
                <div className="w-8 h-8 rounded-none bg-emerald-100 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-700">{formatCurrency(totalIncome)}</div>
                <p className="text-xs text-emerald-600/80 mt-1">
                  Berdasarkan pencatatan pemasukan
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-sm border-red-100 bg-red-50/30">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-red-700">Total Pengeluaran</CardTitle>
                <div className="w-8 h-8 rounded-none bg-red-100 flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">{formatCurrency(totalExpense)}</div>
                <p className="text-xs text-red-600/80 mt-1">
                  Semua kategori pengeluaran
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-sm border-border bg-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                <div className="w-8 h-8 rounded-none bg-secondary flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{formatCurrency(netProfit)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Margin: {margin.toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-none shadow-sm border-border bg-white">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Progress Pembayaran</CardTitle>
                <div className="w-8 h-8 rounded-none bg-secondary flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{termProgress.toFixed(0)}%</div>
                <div className="w-full bg-secondary h-2 mt-2 rounded-none overflow-hidden">
                  <div className="bg-primary h-full transition-all" style={{ width: `${termProgress}%` }} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-none shadow-sm border-border">
              <CardHeader>
                <CardTitle>Detail Proyek</CardTitle>
                <CardDescription>Informasi timeline dan deskripsi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Tanggal Mulai</p>
                    <p className="font-medium text-foreground">
                      {project.startDate ? format(new Date(project.startDate), "dd MMMM yyyy", { locale: localeId }) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Estimasi Selesai</p>
                    <p className="font-medium text-foreground">
                      {project.estimatedEndDate ? format(new Date(project.estimatedEndDate), "dd MMMM yyyy", { locale: localeId }) : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mode Kerja</p>
                    <p className="font-medium text-foreground">{project.mode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pembuat</p>
                    <p className="font-medium text-foreground">{project.creator?.name || "Sistem"}</p>
                  </div>
                </div>
                {project.notes && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Catatan</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{project.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Terms Tab */}
        <TabsContent value="terms" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Termin Pembayaran</h3>
              <p className="text-muted-foreground text-sm">Kelola cicilan pembayaran dari klien.</p>
            </div>
            <CreateTermDialog projectId={project.id} />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {project.terms.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-none border border-border border-dashed">
                <p className="text-muted-foreground">Belum ada termin pembayaran yang ditambahkan.</p>
              </div>
            ) : (
              project.terms.map(term => (
                <TermCard key={term.id} term={term} />
              ))
            )}
          </div>
        </TabsContent>

        {/* Incomes Tab */}
        <TabsContent value="incomes" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Riwayat Pemasukan</h3>
              <p className="text-muted-foreground text-sm">Catat uang masuk terkait proyek ini.</p>
            </div>
            <CreateIncomeDialog projectId={project.id} />
          </div>
          
          {project.incomes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-none border border-border border-dashed">
              <p className="text-muted-foreground">Belum ada pemasukan yang ditambahkan.</p>
            </div>
          ) : (
            <IncomeList incomes={project.incomes} projectId={project.id} />
          )}
        </TabsContent>

        {/* Expenses Tab */}
        <TabsContent value="expenses" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-foreground">Riwayat Pengeluaran</h3>
              <p className="text-muted-foreground text-sm">Catat pengeluaran material, tukang, dll.</p>
            </div>
            <CreateExpenseDialog projectId={project.id} />
          </div>
          
          {project.expenses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-none border border-border border-dashed">
              <p className="text-muted-foreground">Belum ada pengeluaran yang ditambahkan.</p>
            </div>
          ) : (
            <ExpenseList expenses={project.expenses} projectId={project.id} />
          )}
        </TabsContent>

      </Tabs>
    </div>
  );
}
