import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type {
  Connection,
  Category as PrismaCategory,
} from "@/prisma/generated/prisma/client";
import { Difficulty } from "@/app/[locale]/_types";
import { getWordColor } from "@/app/[locale]/_utils";
import DeleteButton from "./delete-button";

type ConnectionWithCategories = Connection & { categories: PrismaCategory[] };

const DIFFICULTY_ORDER: Difficulty[] = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
  Difficulty.EXPERT,
];

export default async function ConnectionList({
  connections,
}: {
  connections: ConnectionWithCategories[];
}) {
  const t = await getTranslations();

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
      {connections.map((connection) => (
        <div key={connection.id} className="bg-gray-100 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="font-semibold text-lg">
              {connection.publishDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <div className="flex gap-2">
              <Link
                href={`/admin/connections/${connection.id}`}
                className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
              >
                {t("admin_edit")}
              </Link>
              <DeleteButton connectionId={connection.id} />
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
      ))}
    </div>
  );
}
