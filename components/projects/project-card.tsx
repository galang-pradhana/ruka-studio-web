import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { Project } from "@prisma/client";

interface ProjectCardProps {
  project: Project & {
    _count?: {
      terms: number;
    };
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isActive = project.status === "ACTIVE";

  const formattedValue = project.contractValue 
    ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(project.contractValue))
    : "Nilai belum diatur";

  return (
    <Link href={`/rs-workspace/projects/${project.id}`} className="block relative group">
      <div className={`relative h-full flex flex-col p-6 rounded-none bg-card overflow-hidden transition-all duration-300 ${isActive ? 'shadow-sm' : ''} hover:scale-[1.02]`}>
        
        {isActive && (
          <BorderBeam 
            size={100}
            duration={10}
            colorFrom="var(--primary)"
            colorTo="var(--primary)"
            borderWidth={1.5}
            className="opacity-50"
          />
        )}

        <div className="flex justify-between items-start mb-4">
          <Badge variant={isActive ? "default" : "secondary"} className="rounded-none px-3 font-medium bg-primary text-white">
            {project.status}
          </Badge>
          <Badge variant="outline" className="rounded-none px-3 text-muted-foreground border-border bg-background">
            {project.mode === "FULL_CONTRACTOR" ? "Full Contractor" : "Consultation"}
          </Badge>
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-1 leading-tight line-clamp-2">
          {project.name}
        </h3>
        <p className="text-muted-foreground font-medium mb-6">
          {project.clientName}
        </p>

        <div className="mt-auto space-y-3">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Nilai Kontrak</p>
              <p className="font-semibold text-foreground">{formattedValue}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">Termin</p>
              <p className="font-medium text-foreground">{project._count?.terms || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
