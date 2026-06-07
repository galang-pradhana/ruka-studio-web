import { prisma } from "@/lib/prisma";
import { TrendingUp, FolderOpen, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function DashboardStats() {
  // Fetch aggregate data
  const [
    totalProjects,
    activeProjects,
    incomeAgg,
    expenseAgg,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "ACTIVE" } }),
    prisma.projectIncome.aggregate({ _sum: { amount: true } }),
    prisma.projectExpense.aggregate({ _sum: { amount: true } }),
  ]);

  const totalIncome = Number(incomeAgg._sum.amount ?? 0);
  const totalExpense = Number(expenseAgg._sum.amount ?? 0);
  const profit = totalIncome - totalExpense;

  const stats = [
    {
      label: "Total Proyek",
      value: `${totalProjects}`,
      sub: `${activeProjects} aktif`,
      icon: FolderOpen,
      iconBg: "#EEF4FF",
      iconColor: "#1B3B5A",
    },
    {
      label: "Total Pendapatan",
      value: formatRupiah(totalIncome),
      sub: "Semua waktu",
      icon: ArrowDownCircle,
      iconBg: "#EDFAF3",
      iconColor: "#0A6640",
    },
    {
      label: "Total Pengeluaran",
      value: formatRupiah(totalExpense),
      sub: "Semua waktu",
      icon: ArrowUpCircle,
      iconBg: "#FFF3F0",
      iconColor: "#b64400",
    },
    {
      label: "Profit Bersih",
      value: formatRupiah(profit),
      sub: profit >= 0 ? "Positif" : "Perlu perhatian",
      icon: TrendingUp,
      iconBg: profit >= 0 ? "#EDFAF3" : "#FFF3F0",
      iconColor: profit >= 0 ? "#0A6640" : "#b64400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E8E2DD",
              borderRadius: "0px",
              padding: "20px 24px",
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#6B6B6B",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </p>
              <div
                className="flex items-center justify-center w-8 h-8 flex-shrink-0"
                style={{
                  backgroundColor: stat.iconBg,
                  borderRadius: "0px",
                }}
              >
                <Icon size={16} style={{ color: stat.iconColor }} />
              </div>
            </div>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1A1A1A",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
              }}
            >
              {stat.value}
            </p>
            <p
              className="mt-1"
              style={{ fontSize: "12px", color: "#9B9B9B" }}
            >
              {stat.sub}
            </p>
          </div>
        );
      })}
    </div>
  );
}
