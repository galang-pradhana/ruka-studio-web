import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProjectBriefs } from "@/app/actions/brief.actions";
import { BriefsManagementClient } from "./BriefsManagementClient";

export const metadata = {
  title: "Brief Klien | Ruka Studio Admin",
};

export default async function BriefsPage() {
  const session = await auth();

  if (!session || (session.user.role !== "OWNER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  const { data: briefs, error } = await getProjectBriefs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A2530] tracking-wide" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            Brief Klien
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola database dan kiriman brief perencanaan proyek dari calon klien.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm">
          {error}
        </div>
      ) : (
        <BriefsManagementClient initialBriefs={briefs || []} />
      )}
    </div>
  );
}
