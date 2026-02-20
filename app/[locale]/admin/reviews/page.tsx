import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getReviews, ReviewSortField, SortDir } from "../_actions/reviews";
import ReviewsTable from "../_components/reviews-table";
import Pagination from "../_components/pagination";

const VALID_SORT_FIELDS: ReviewSortField[] = [
  "createdAt",
  "difficulty",
  "reviewerName",
];
const VALID_SORT_DIRS: SortDir[] = ["asc", "desc"];

type Props = {
  searchParams: Promise<{ page?: string; sortBy?: string; sortDir?: string }>;
};

export default async function ReviewsPage({ searchParams }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const {
    page: pageParam,
    sortBy: sortByParam,
    sortDir: sortDirParam,
  } = await searchParams;

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const sortBy = VALID_SORT_FIELDS.includes(sortByParam as ReviewSortField)
    ? (sortByParam as ReviewSortField)
    : "createdAt";
  const sortDir = VALID_SORT_DIRS.includes(sortDirParam as SortDir)
    ? (sortDirParam as SortDir)
    : "desc";

  const { reviews, totalPages } = await getReviews(page, 20, sortBy, sortDir);
  const t = await getTranslations();

  return (
    <div className="p-8">
      <h1 className="text-black text-4xl font-semibold mb-6">
        {t("admin_reviews")}
      </h1>
      <ReviewsTable reviews={reviews} sortBy={sortBy} sortDir={sortDir} />
      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/reviews"
        params={{ sortBy, sortDir }}
      />
    </div>
  );
}
