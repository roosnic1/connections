import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ConnectionForm from "../../_components/connection-form";

export default async function NewConnectionPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const t = await getTranslations();

  return (
    <div className="p-8">
      <h1 className="text-black text-4xl font-semibold mb-6">
        {t("admin_newConnection")}
      </h1>
      <div className="bg-gray-100 rounded-lg p-6">
        <ConnectionForm />
      </div>
    </div>
  );
}
