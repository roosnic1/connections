import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import AdminLoginPage from "./login/page";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <AdminLoginPage />;
  }

  const t = await getTranslations();

  return (
    <div className="p-10">
      <h1 className="text-black text-4xl font-semibold">{t("admin_title")}</h1>
    </div>
  );
}
