"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Difficulty } from "@/app/[locale]/_types";
import type { Category as PrismaCategory } from "@/prisma/generated/prisma/client";
import {
  createConnection,
  updateConnection,
  type ConnectionActionState,
} from "../_actions/connections";
import CategoryFields from "./category-fields";

const DIFFICULTIES = [
  Difficulty.EASY,
  Difficulty.MEDIUM,
  Difficulty.HARD,
  Difficulty.EXPERT,
] as const;

type ConnectionFormProps = {
  connectionId?: number;
  defaultPublishDate?: string;
  categories?: PrismaCategory[];
};

export default function ConnectionForm({
  connectionId,
  defaultPublishDate = "",
  categories = [],
}: ConnectionFormProps) {
  const action = connectionId
    ? updateConnection.bind(null, connectionId)
    : createConnection;

  const [state, formAction, isPending] = useActionState<
    ConnectionActionState,
    FormData
  >(action, {});

  const t = useTranslations();

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {state.error}
        </div>
      )}

      <div>
        <label
          htmlFor="publishDate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {t("admin_publishDate")}
        </label>
        <input
          type="date"
          id="publishDate"
          name="publishDate"
          defaultValue={defaultPublishDate}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      {DIFFICULTIES.map((level) => {
        const category = categories.find((c) => c.level === level);
        return (
          <CategoryFields
            key={level}
            level={level}
            defaultTitle={category?.title}
            defaultWords={category?.words}
          />
        );
      })}

      <div className="flex gap-3">
        <Link
          href="/admin/connections"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          {t("admin_cancel")}
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {isPending ? t("admin_saving") : t("admin_save")}
        </button>
      </div>
    </form>
  );
}
