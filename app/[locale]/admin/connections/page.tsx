import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getConnections } from "../_actions/connections";
import { ConnectionState } from "@/app/[locale]/_types";
import ConnectionList from "../_components/connection-list";
import Pagination from "../_components/pagination";
import StateFilterBar from "../_components/state-filter-bar";

type Props = {
  searchParams: Promise<{ page?: string; state?: string }>;
};

export default async function ConnectionsPage({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  const { page: pageParam, state: stateParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const validStates: string[] = Object.values(ConnectionState);
  const stateFilter =
    stateParam && validStates.includes(stateParam)
      ? (stateParam as ConnectionState)
      : undefined;

  const { connections, totalPages } = await getConnections(
    page,
    10,
    stateFilter,
  );
  const t = await getTranslations();

  return (
    <div className="w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-black text-4xl font-semibold">
          {t("admin_connections")}
        </h1>
        <Link
          href="/admin/connections/new"
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {t("admin_newConnection")}
        </Link>
      </div>
      <StateFilterBar currentState={stateFilter} />
      <ConnectionList connections={connections} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
