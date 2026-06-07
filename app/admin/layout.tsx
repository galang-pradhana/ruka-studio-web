import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata = {
  title: "Admin | Ruka Studio",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen"
      style={{ backgroundColor: "#F8F9FA", fontFamily: "var(--font-montserrat, sans-serif)" }}
    >
      <AdminSidebar role={(session?.user as any)?.role} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col">
        {children}
      </main>
    </div>
  );
}
