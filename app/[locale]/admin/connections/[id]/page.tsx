import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getConnection } from "../../_actions/connections";
import ConnectionForm from "../../_components/connection-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditConnectionPage({ params }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const connectionId = parseInt(id, 10);
  if (isNaN(connectionId)) {
    notFound();
  }

  const connection = await getConnection(connectionId);
  if (!connection) {
    notFound();
  }

  const publishDate = connection.publishDate.toISOString().split("T")[0];
  const t = await getTranslations();

  return (
    <div className="w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <h1 className="text-black text-4xl font-semibold mb-6">
        {t("admin_editConnection")}
      </h1>
      <div className="bg-gray-100 rounded-lg p-6">
        <ConnectionForm
          connectionId={connection.id}
          defaultPublishDate={publishDate}
          categories={connection.categories}
        />
      </div>
    </div>
  );
}
