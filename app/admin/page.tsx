import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentProjects } from "@/components/admin/recent-projects";
import { Plus } from "lucide-react";

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E8E2DD",
            borderRadius: "2px",
            padding: "20px 24px",
            height: "108px",
          }}
        />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div
      className="animate-pulse"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8E2DD",
        borderRadius: "2px",
        height: "280px",
      }}
    />
  );
}

export default async function AdminDashboardPage() {
  const session = await auth();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-[1200px] w-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p style={{ fontSize: "12px", color: "#9B9B9B", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "4px" }}>
            {greeting},
          </p>
          <h1
            style={{
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 700,
              color: "#1A1A1A",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {session?.user?.name ?? "Admin"} 👋
          </h1>
          <p style={{ fontSize: "13px", color: "#6B6B6B", marginTop: "4px" }}>
            Berikut ringkasan bisnis Ruka Studio hari ini.
          </p>
        </div>

        <CreateProjectDialog 
          triggerClassName="flex items-center gap-2 cursor-pointer transition-opacity duration-150 hover:opacity-80 flex-shrink-0 rounded-none bg-[#1B3B5A] text-[#F4EFEB] px-[18px] py-[10px] text-[12px] font-bold tracking-[0.08em] uppercase h-auto shadow-none hover:bg-[#1B3B5A]/90 hover:text-[#F4EFEB]"
        />
      </div>

      {/* Stats */}
      <section>
        <h2
          className="mb-4"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#9B9B9B",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Ringkasan Finansial
        </h2>
        <Suspense fallback={<StatsSkeleton />}>
          <DashboardStats />
        </Suspense>
      </section>

      {/* Recent Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#9B9B9B",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Proyek Terbaru
          </h2>
          <Link
            href="/admin/projects"
            className="cursor-pointer hover:underline"
            style={{ fontSize: "12px", color: "#1B3B5A", fontWeight: 600 }}
          >
            Lihat semua →
          </Link>
        </div>
        <Suspense fallback={<TableSkeleton />}>
          <RecentProjects />
        </Suspense>
      </section>
    </div>
  );
}
