"use client";

import { useTranslations } from "next-intl";
import { Difficulty } from "@/app/[locale]/_types";
import { getWordColor } from "@/app/[locale]/_utils";

type CategoryFieldsProps = {
  level: Difficulty;
  defaultTitle?: string;
  defaultWords?: string[];
};

export default function CategoryFields({
  level,
  defaultTitle = "",
  defaultWords = ["", "", "", ""],
}: CategoryFieldsProps) {
  const t = useTranslations();

  return (
    <div className="rounded-lg overflow-hidden">
      <div className={`${getWordColor(level)} px-4 py-2 font-semibold text-sm`}>
        {level}
      </div>
      <div className="bg-gray-50 p-4 space-y-3">
        <div>
          <label
            htmlFor={`category_${level}_title`}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("admin_categoryTitle")}
          </label>
          <input
            type="text"
            id={`category_${level}_title`}
            name={`category_${level}_title`}
            defaultValue={defaultTitle}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("admin_categoryWords")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                name={`category_${level}_word_${i}`}
                defaultValue={defaultWords[i] ?? ""}
                required
                placeholder={t("admin_wordPlaceholder", { number: i + 1 })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
