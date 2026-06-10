import ProjectForm from "../_components/ProjectForm";

export const metadata = {
  title: "Tambah Proyek | Ruka Studio Admin",
};

export default function AddProjectPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#1A2530] tracking-wide">Tambah Proyek</h1>
        <p className="text-sm text-gray-500">Tambahkan karya terbaru ke dalam portofolio Anda.</p>
      </div>

      <ProjectForm />
    </div>
  );
}
