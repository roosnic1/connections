import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AdminLogoutButton from "./_components/admin-logout-button";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const t = await getTranslations();

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold my-4">
        {t("admin_title")}
      </h1>
      <div className="bg-gray-100 rounded-lg p-6 w-full">
        <p className="text-black mb-2">
          {t("admin_loggedInAs", {
            name: session.user.name || session.user.email,
          })}
        </p>
        <p className="text-black mb-4">
          {t("admin_email", { email: session.user.email })}
        </p>
        <div className="flex gap-3">
          <Link
            href="/admin/connections"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            {t("admin_manageConnections")}
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
    </div>
  );
}
