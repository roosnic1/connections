import Link from "next/link";
import { getTranslations } from "next-intl/server";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath?: string;
  params?: Record<string, string>;
};

export default async function Pagination({
  page,
  totalPages,
  basePath = "/admin/connections",
  params = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const t = await getTranslations();

  function buildHref(p: number) {
    const searchParams = new URLSearchParams({ ...params, page: String(p) });
    return `${basePath}?${searchParams}`;
  }

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {t("admin_previous")}
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg">
          {t("admin_previous")}
        </span>
      )}
      <span className="text-sm text-gray-600">
        {t("admin_pageOf", { page, totalPages })}
      </span>
      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          {t("admin_next")}
        </Link>
      ) : (
        <span className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg">
          {t("admin_next")}
        </span>
      )}
    </div>
  );
}
