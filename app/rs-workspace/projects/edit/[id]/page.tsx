import ProjectForm from "../../_components/ProjectForm";
import { getProjectById } from "@/app/actions/project.actions";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Proyek | Ruka Studio Admin",
};

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { data: project, error } = await getProjectById(params.id);

  if (error || !project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#1A2530] tracking-wide">Edit Proyek</h1>
        <p className="text-sm text-gray-500">Perbarui informasi portofolio Anda.</p>
      </div>

      <ProjectForm initialData={project} />
    </div>
  );
}
