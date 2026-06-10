import { getProjects } from "@/app/actions/projects";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { EditProjectDialog } from "@/components/projects/edit-project-dialog";
import { DeleteProjectButton } from "@/components/projects/delete-project-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MapPin, Calendar, Wallet } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pembukuan Proyek | Ruka Studio Admin",
};

export default async function ProjectsPage() {
  const { data: projects, error } = await getProjects();

  // Helper to format currency
  const formatIDR = (value: any) => {
    if (value === null || value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(value));
  };

  // Helper to format date
  const formatDate = (dateVal: any) => {
    if (!dateVal) return "-";
    return new Date(dateVal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper to get status classes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "COMPLETED":
        return "bg-blue-50 text-blue-700 border border-blue-100";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border border-rose-100";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Aktif";
      case "COMPLETED":
        return "Selesai";
      case "PENDING":
        return "Tertunda";
      case "CANCELLED":
        return "Batal";
      default:
        return status;
    }
  };

  const getModeLabel = (mode: string) => {
    return mode === "FULL_CONTRACTOR" ? "Full Kontraktor" : "Konsultasi & Desain";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A2530] tracking-wide" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>Pembukuan Proyek</h1>
          <p className="text-sm text-gray-500 mt-1">Pencatatan keuangan dan bookkeeping proyek internal studio.</p>
        </div>
        <CreateProjectDialog 
          triggerClassName="rounded-none bg-[#1A2530] hover:bg-[#2C3E50] text-[#E8E1D5] px-5 py-2 h-10 inline-flex items-center text-sm shadow-none"
          buttonText="Tambah Proyek Baru"
        />
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-gray-50/50 border-b border-gray-200">
              <TableRow>
                <TableHead className="font-semibold text-gray-700 text-sm">Nama Proyek</TableHead>
                <TableHead className="font-semibold text-gray-700 text-sm">Klien</TableHead>
                <TableHead className="font-semibold text-gray-700 text-sm">Mode</TableHead>
                <TableHead className="font-semibold text-gray-700 text-sm">Nilai Kontrak</TableHead>
                <TableHead className="font-semibold text-gray-700 text-sm">Tanggal Mulai</TableHead>
                <TableHead className="font-semibold text-gray-700 text-sm text-center">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 text-sm text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <TableRow key={project.id} className="hover:bg-gray-50/30 border-b border-gray-100 last:border-0 transition-colors">
                    <TableCell className="align-middle">
                      <div>
                        <Link 
                          href={`/rs-workspace/projects/${project.id}`} 
                          className="font-medium text-[#1A2530] hover:text-[#1B3B5A] hover:underline block text-[15px]"
                        >
                          {project.name}
                        </Link>
                        {project.location && (
                          <span className="inline-flex items-center text-xs text-gray-400 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" /> {project.location}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="align-middle text-gray-600 font-medium text-[14px]">
                      {project.clientName}
                    </TableCell>
                    
                    <TableCell className="align-middle text-gray-500 text-[13px]">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-none text-xs font-medium">
                        {getModeLabel(project.mode)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="align-middle text-gray-700 font-mono text-[14px]">
                      <span className="inline-flex items-center">
                        <Wallet className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {formatIDR(project.contractValue)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="align-middle text-gray-500 text-[13px]">
                      <span className="inline-flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                        {formatDate(project.startDate)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="align-middle text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-none ${getStatusBadge(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="align-middle text-right space-x-2">
                      <Link href={`/rs-workspace/projects/${project.id}`}>
                        <Button variant="outline" size="sm" className="rounded-none h-8 px-2 border-gray-200 hover:bg-gray-50 hover:text-[#1A2530]">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      <EditProjectDialog project={project} />
                      
                      <DeleteProjectButton projectId={project.id} projectName={project.name} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p>Belum ada data proyek pembukuan.</p>
                      <CreateProjectDialog 
                        triggerClassName="rounded-none bg-[#1A2530]/10 hover:bg-[#1A2530]/20 text-[#1A2530] border border-[#1A2530]/20 px-4 py-1.5 h-9 inline-flex items-center text-xs mt-2"
                        buttonText="Mulai Proyek Pertama"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
