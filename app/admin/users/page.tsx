import { getUsers } from "@/app/actions/users";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserManagementClient } from "./UserManagementClient";

export const metadata = {
  title: "Manajemen User | Ruka Studio Admin",
};

export default async function UsersPage() {
  const session = await auth();

  if (session?.user?.role !== "OWNER") {
    redirect("/admin");
  }

  const { data: users, error } = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A2530] tracking-wide" style={{ fontFamily: "var(--font-montserrat, sans-serif)" }}>
            Manajemen User
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola akses dan hak pengguna sistem. Hanya OWNER yang dapat mengakses halaman ini.
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-sm rounded">
          {error}
        </div>
      ) : (
        <UserManagementClient users={users || []} currentUserId={session?.user?.id || ""} />
      )}
    </div>
  );
}
