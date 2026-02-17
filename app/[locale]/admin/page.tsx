import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminLogoutButton from "./_components/admin-logout-button";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold my-4">Admin</h1>
      <div className="bg-gray-100 rounded-lg p-6 w-full">
        <p className="text-black mb-2">
          Logged in as: {session.user.name || session.user.email}
        </p>
        <p className="text-black mb-4">Email: {session.user.email}</p>
        <AdminLogoutButton />
      </div>
    </div>
  );
}
