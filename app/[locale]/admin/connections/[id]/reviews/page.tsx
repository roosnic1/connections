import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, getFormatter } from "next-intl/server";
import { getConnectionReviews } from "../../../_actions/reviews";
import GuessHistory from "@/app/[locale]/_components/guess-history";
import { getWordColor } from "@/app/[locale]/_utils";
import { Difficulty, Word } from "@/app/[locale]/_types";

const DIFFICULTY_ORDER: Difficulty[] = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
  Difficulty.EXPERT,
];

type Props = { params: Promise<{ id: string }> };

export default async function ConnectionReviewsPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const connectionId = parseInt(id, 10);
  if (isNaN(connectionId)) notFound();

  const { reviews, connection, count, avgDifficulty } =
    await getConnectionReviews(connectionId);

  if (!connection) notFound();

  const t = await getTranslations();
  const format = await getFormatter();

  const winCount = reviews.filter((r) => r.isWon).length;

  return (
    <div className="p-8">
      <Link
        href="/admin/connections"
        className="text-sm text-gray-500 hover:text-black mb-6 inline-block"
      >
        ← {t("admin_manageConnections")}
      </Link>

      <h1 className="text-black text-4xl font-semibold mb-2">
        {t("admin_reviews")}
      </h1>
      <p className="text-gray-500 mb-6">
        {connection.publishDate
          ? format.dateTime(connection.publishDate, { dateStyle: "long" })
          : `#${connection.id}`}
      </p>

      <div className="grid grid-cols-1 gap-2 mb-8">
        {DIFFICULTY_ORDER.map((level) => {
          const category = connection.categories.find((c) => c.level === level);
          if (!category) return null;
          return (
            <div
              key={category.id}
              className={`${getWordColor(level)} rounded px-3 py-2`}
            >
              <span className="font-semibold text-sm">{category.title}</span>
              <span className="text-sm ml-2">{category.words.join(", ")}</span>
            </div>
          );
        })}
      </div>

      {count === 0 ? (
        <p className="text-gray-500 py-8">{t("admin_connectionNoReviews")}</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">{count}</p>
              <p className="text-sm text-gray-500 mt-1">
                {t("admin_reviewCount", { count })}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">
                {avgDifficulty?.toFixed(1) ?? "—"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("admin_avgDifficulty")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-3xl font-bold">
                {Math.round((winCount / count) * 100)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">{t("admin_winRate")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {reviews.map((review) => {
              const guessHistory = review.guessHistory as Word[][];
              return (
                <Link
                  key={review.id}
                  href={`/admin/reviews/${review.id}`}
                  className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors block"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">
                        {review.reviewerName}
                      </span>
                      <span className="text-xs text-gray-400">
                        {format.dateTime(review.createdAt, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          review.isWon
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {review.isWon ? t("admin_won") : t("admin_lost")}
                      </span>
                      <span className="text-sm">
                        <span className="font-semibold">
                          {review.difficulty}
                        </span>
                        <span className="text-gray-400">/5</span>
                      </span>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 mb-3">
                      {review.comment}
                    </p>
                  )}
                  <GuessHistory guessHistory={guessHistory} />
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
