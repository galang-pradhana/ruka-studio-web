import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";

const STATUS_MAP: Record<string, { label: string; bg: string; color: string }> = {
  ACTIVE: { label: "Aktif", bg: "#EDFAF3", color: "#0A6640" },
  COMPLETED: { label: "Selesai", bg: "#EEF4FF", color: "#1B3B5A" },
  PENDING: { label: "Pending", bg: "#FFF9EB", color: "#8A5B00" },
  CANCELLED: { label: "Dibatalkan", bg: "#FFF3F0", color: "#b64400" },
};

const MODE_MAP: Record<string, string> = {
  CONSULTATION: "Konsultasi",
  FULL_CONTRACTOR: "Full Contractor",
};

export async function RecentProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      clientName: true,
      status: true,
      mode: true,
      startDate: true,
      contractValue: true,
    },
  });

  if (projects.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E8E2DD",
          borderRadius: "0px",
        }}
      >
        <div
          className="w-10 h-10 flex items-center justify-center mb-3"
          style={{ backgroundColor: "#F4EFEB", borderRadius: "0px" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B6B6B"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
        </div>
        <p style={{ fontSize: "14px", color: "#6B6B6B" }}>Belum ada proyek.</p>
        <CreateProjectDialog 
          triggerClassName="mt-3 bg-transparent hover:bg-transparent text-[#1B3B5A] font-semibold text-[13px] hover:underline shadow-none p-0 h-auto"
          buttonText="Tambah Proyek Pertama"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8E2DD",
        borderRadius: "0px",
        overflow: "hidden",
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #E8E2DD" }}>
              {["Proyek / Klien", "Mode", "Tanggal Mulai", "Nilai Kontrak", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left"
                    style={{
                      padding: "12px 16px",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#9B9B9B",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {projects.map((project, i) => {
              const statusInfo = STATUS_MAP[project.status] ?? STATUS_MAP.PENDING;
              const value = project.contractValue
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(Number(project.contractValue))
                : "—";
              return (
                <tr
                  key={project.id}
                  style={{
                    borderBottom:
                      i < projects.length - 1 ? "1px solid #F4F4F4" : "none",
                  }}
                  className="transition-colors duration-100 hover:bg-gray-50"
                >
                  <td style={{ padding: "14px 16px" }}>
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="cursor-pointer hover:underline"
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#1A1A1A",
                          marginBottom: "2px",
                        }}
                      >
                        {project.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#9B9B9B" }}>
                        {project.clientName}
                      </div>
                    </Link>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{ fontSize: "12px", color: "#6B6B6B" }}>
                      {MODE_MAP[project.mode] ?? project.mode}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <span style={{ fontSize: "12px", color: "#6B6B6B" }}>
                      {project.startDate
                        ? format(new Date(project.startDate), "dd MMM yyyy", {
                            locale: idLocale,
                          })
                        : "—"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#1A1A1A",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {value}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      className="inline-flex items-center px-2 py-0.5"
                      style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        borderRadius: "0px",
                        fontSize: "11px",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
