import Link from "next/link";
import { getTranslations, getFormatter } from "next-intl/server";
import type {
  Connection,
  Category as PrismaCategory,
} from "@/prisma/generated/prisma/client";
import { ConnectionState } from "@/app/[locale]/_types";
import { Difficulty } from "@/app/[locale]/_types";
import { getWordColor } from "@/app/[locale]/_utils";
import DeleteButton from "./delete-button";
import StateTransitionButton from "./state-transition-button";

type ConnectionWithCategories = Connection & { categories: PrismaCategory[] };

const DIFFICULTY_ORDER: Difficulty[] = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
  Difficulty.EXPERT,
];

const STATE_BG: Record<ConnectionState, string> = {
  [ConnectionState.DRAFT]: "bg-gray-100",
  [ConnectionState.REVIEW]: "bg-orange-100",
  [ConnectionState.PUBLISHED]: "bg-rose-100",
};

export default async function ConnectionList({
  connections,
}: {
  connections: ConnectionWithCategories[];
}) {
  const t = await getTranslations();
  const format = await getFormatter();

  if (connections.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">
        {t("admin_noConnections")}{" "}
        <Link href="/admin/connections/new" className="text-blue-600 underline">
          {t("admin_createOne")}
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {connections.map((connection) => {
        const isEditable = connection.state === ConnectionState.DRAFT;
        const dateLabel = connection.publishDate
          ? format.dateTime(connection.publishDate, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : t("admin_noPublishDate");

        return (
          <div
            key={connection.id}
            className={`${STATE_BG[connection.state]} rounded-lg p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="font-semibold text-lg">{dateLabel}</span>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>
                    {t("admin_createDate")}:{" "}
                    {format.dateTime(connection.createdAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  <p>
                    {t("admin_updateDate")}:{" "}
                    {format.dateTime(connection.updatedAt, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <StateTransitionButton
                  connectionId={connection.id}
                  currentState={connection.state}
                  publishDate={connection.publishDate ?? null}
                />
                <div className="w-px h-4 bg-gray-400 mx-0.5" />
                {isEditable ? (
                  <Link
                    href={`/admin/connections/${connection.id}`}
                    className="px-2 py-0.5 bg-black text-white text-xs rounded hover:bg-gray-800"
                  >
                    {t("admin_edit")}
                  </Link>
                ) : (
                  <span className="px-2 py-0.5 bg-black text-white text-xs rounded opacity-50 cursor-not-allowed">
                    {t("admin_edit")}
                  </span>
                )}
                {isEditable ? (
                  <DeleteButton connectionId={connection.id} />
                ) : (
                  <button
                    disabled
                    className="px-2 py-0.5 bg-red-500 text-white text-xs rounded opacity-50 cursor-not-allowed"
                  >
                    {t("admin_delete")}
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {DIFFICULTY_ORDER.map((level) => {
                const category = connection.categories.find(
                  (c) => c.level === level,
                );
                if (!category) return null;
                return (
                  <div
                    key={category.id}
                    className={`${getWordColor(level)} rounded px-3 py-2`}
                  >
                    <span className="font-semibold text-sm">
                      {category.title}
                    </span>
                    <span className="text-sm ml-2">
                      {category.words.join(", ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
