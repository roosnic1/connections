"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Category, ConnectionGame } from "@/app/_types";

type RowDetailsProps = {
  categories: Category[];
};

type CollapsibleRowProps = {
  data: string[];
  categories: Category[];
};

type CollapsibleTableProps = {
  connections: ConnectionGame[];
};

const RowDetails = ({ categories }: RowDetailsProps) => {
  const t = useTranslations("admin");

  return (
    <tr>
      <td colSpan={4} className="p-4 bg-gray-50">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {[
                t("category"),
                t("word1"),
                t("word2"),
                t("word3"),
                t("word4"),
              ].map((h, i) => (
                <th key={i} className="py-2 px-3 text-left text-sm font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 px-3">{category.category}</td>
                {category.items.map((cell, j) => (
                  <td key={j} className="py-2 px-3">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
};

const CollapsibleRow = ({ data, categories }: CollapsibleRowProps) => {
  const [open, setOpen] = useState(false);

  const t = useTranslations("admin");

  return (
    <>
      <tr className="border-b hover:bg-gray-100">
        {data.map((cell, i) => (
          <td key={i} className="py-3 px-4">
            {cell}
          </td>
        ))}
        <td className="py-3 px-4">
          <button
            onClick={() => setOpen(!open)}
            className="text-blue-600 hover:underline"
          >
            {open ? t("hide") : t("show")}
          </button>
        </td>
      </tr>
      {open && <RowDetails categories={categories} />}
    </>
  );
};

export default function CollapsibleTable({
  connections,
}: CollapsibleTableProps) {
  const t = useTranslations("admin");

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded p-4 w-full">
      <table className="w-full min-w-full">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">{t("id")}</th>
            <th className="py-3 px-4 text-left">{t("publishDate")}</th>
            <th className="py-3 px-4 text-left">{t("createDate")}</th>
            <th className="py-3 px-4 text-left">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection, i) => {
            const data = [
              connection.id.toString(),
              connection.publishDate.toDateString(),
              "fake",
            ];
            return (
              <CollapsibleRow
                key={i}
                data={data}
                categories={connection.categories}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
