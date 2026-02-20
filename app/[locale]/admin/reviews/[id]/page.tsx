import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, getFormatter } from "next-intl/server";
import { getReview } from "../../_actions/reviews";
import GuessHistory from "@/app/[locale]/_components/guess-history";
import { getWordColor } from "@/app/[locale]/_utils";
import { Difficulty, Word } from "@/app/[locale]/_types";

const DIFFICULTY_ORDER: Difficulty[] = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
  Difficulty.EXPERT,
];

const VALID_DIFFICULTIES = new Set<string>(Object.values(Difficulty));

function isWord(v: unknown): v is Word {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.word === "string" && VALID_DIFFICULTIES.has(obj.level as string)
  );
}

function parseGuessHistory(raw: unknown): Word[][] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Array.isArray)
    .map((row) => (row as unknown[]).filter(isWord));
}

type Props = { params: Promise<{ id: string }> };

export default async function ReviewDetailPage({ params }: Props) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const reviewId = parseInt(id, 10);
  if (isNaN(reviewId)) notFound();

  const review = await getReview(reviewId);
  if (!review) notFound();

  const t = await getTranslations();
  const format = await getFormatter();

  const guessHistory = parseGuessHistory(review.guessHistory);

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/reviews"
        className="text-sm text-gray-500 hover:text-black mb-6 inline-block"
      >
        {t("admin_backToReviews")}
      </Link>

      <h1 className="text-black text-4xl font-semibold mb-6">
        {t("admin_reviewDetail")}
      </h1>

      <div className="bg-gray-50 rounded-lg p-6 mb-8 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {t("admin_reviewer")}
          </p>
          <p className="font-semibold">{review.reviewerName}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {t("admin_createDate")}
          </p>
          <p>
            {format.dateTime(review.createdAt, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {t("admin_difficulty")}
          </p>
          <p>
            <span className="font-semibold">{review.difficulty}</span>
            <span className="text-gray-400">/5</span>
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {t("admin_result")}
          </p>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              review.isWon
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {review.isWon ? t("admin_won") : t("admin_lost")}
          </span>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {t("admin_comment")}
          </p>
          {review.comment ? (
            <p>{review.comment}</p>
          ) : (
            <p className="text-gray-400 italic">{t("admin_noComment")}</p>
          )}
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {t("admin_connection")}
          </p>
          <Link
            href={`/admin/connections/${review.connectionId}/reviews`}
            className="text-blue-600 hover:underline"
          >
            #{review.connectionId}
            {review.connection.publishDate
              ? ` — ${format.dateTime(review.connection.publishDate, { dateStyle: "medium" })}`
              : ""}
          </Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">{t("admin_guessHistory")}</h2>
      <GuessHistory guessHistory={guessHistory} showWords />

      <h2 className="text-xl font-semibold mt-8 mb-4">
        {t("admin_connection")}
      </h2>
      <div className="grid grid-cols-1 gap-2">
        {DIFFICULTY_ORDER.map((level) => {
          const category = review.connection.categories.find(
            (c) => c.level === level,
          );
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
    </div>
  );
}
