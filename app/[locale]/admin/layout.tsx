import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AdminLogoutButton from "./_components/admin-logout-button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const t = await getTranslations();

  return (
    <div className="flex h-full overflow-hidden">
      <aside className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col p-6 gap-6 shrink-0">
        {session ? (
          <>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {t("admin_loggedInAs", {
                  name: session.user.name || session.user.email,
                })}
              </p>
              <p className="text-sm font-medium text-black truncate">
                {session.user.email}
              </p>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              <Link
                href="/admin/connections"
                className="px-3 py-2 rounded-lg text-sm font-medium text-black hover:bg-gray-200 transition-colors"
              >
                {t("admin_manageConnections")}
              </Link>
              <Link
                href="/admin/reviews"
                className="px-3 py-2 rounded-lg text-sm font-medium text-black hover:bg-gray-200 transition-colors"
              >
                {t("admin_manageReviews")}
              </Link>
            </nav>

            <AdminLogoutButton />
          </>
        ) : null}
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
