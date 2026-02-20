import Link from "next/link";
import { getTranslations, getFormatter } from "next-intl/server";
import type { Review, Connection } from "@/prisma/generated/prisma/client";
import type { ReviewSortField, SortDir } from "../_actions/reviews";

type ReviewWithConnection = Review & {
  connection: Pick<Connection, "id" | "publishDate">;
};

type ReviewsTableProps = {
  reviews: ReviewWithConnection[];
  sortBy: ReviewSortField;
  sortDir: SortDir;
  basePath?: string;
};

export default async function ReviewsTable({
  reviews,
  sortBy,
  sortDir,
  basePath = "/admin/reviews",
}: ReviewsTableProps) {
  const t = await getTranslations();
  const format = await getFormatter();

  const base = basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

  function sortLink(field: ReviewSortField) {
    const newDir = sortBy === field && sortDir === "asc" ? "desc" : "asc";
    return `${base}?sortBy=${field}&sortDir=${newDir}`;
  }

  function sortIcon(field: ReviewSortField) {
    if (sortBy !== field) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  if (reviews.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">{t("admin_noReviews")}</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              <Link
                href={sortLink("createdAt")}
                className="hover:text-black inline-flex items-center gap-1"
              >
                {t("admin_createDate")}
                {sortIcon("createdAt")}
              </Link>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              <Link
                href={sortLink("reviewerName")}
                className="hover:text-black inline-flex items-center gap-1"
              >
                {t("admin_reviewer")}
                {sortIcon("reviewerName")}
              </Link>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              {t("admin_connection")}
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              <Link
                href={sortLink("difficulty")}
                className="hover:text-black inline-flex items-center gap-1"
              >
                {t("admin_difficulty")}
                {sortIcon("difficulty")}
              </Link>
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              {t("admin_result")}
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-600">
              {t("admin_comment")}
            </th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr
              key={review.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                <Link
                  href={`${base}/${review.id}`}
                  className="block hover:underline"
                >
                  {format.dateTime(review.createdAt, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Link>
              </td>
              <td className="py-3 px-4 font-medium">
                <Link
                  href={`${base}/${review.id}`}
                  className="block hover:underline"
                >
                  {review.reviewerName}
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link
                  href={`/admin/connections/${review.connectionId}/reviews`}
                  className="text-blue-600 hover:underline"
                >
                  #{review.connectionId}
                  {review.connection.publishDate
                    ? ` — ${format.dateTime(review.connection.publishDate, { dateStyle: "medium" })}`
                    : ""}
                </Link>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <Link
                  href={`${base}/${review.id}`}
                  className="block hover:underline"
                >
                  <span className="font-semibold">{review.difficulty}</span>
                  <span className="text-gray-400">/5</span>
                </Link>
              </td>
              <td className="py-3 px-4">
                <Link href={`${base}/${review.id}`} className="block">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      review.isWon
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {review.isWon ? t("admin_won") : t("admin_lost")}
                  </span>
                </Link>
              </td>
              <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                <Link
                  href={`${base}/${review.id}`}
                  className="block hover:underline"
                >
                  {review.comment ?? (
                    <span className="italic">{t("admin_noComment")}</span>
                  )}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
