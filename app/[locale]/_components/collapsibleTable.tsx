"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Category, ConnectionGame, Word } from "@/app/[locale]/_types";
import { useTranslate } from "@tolgee/react";

type RowDetailsProps = {
  categories: CategoriesState[];
  edit: boolean;
  setCategoriesState: React.Dispatch<React.SetStateAction<CategoriesState[]>>;
};

type CollapsibleRowProps = {
  id: number;
  createUpdateDates: Date[];
  publishDate: Date;
  categories: Category[];
};

type CollapsibleTableProps = {
  connections: ConnectionGame[];
};

type CategoriesState = [number, string, string[]];

const RowDetails = ({
  categories,
  edit,
  setCategoriesState,
}: RowDetailsProps) => {
  const { t } = useTranslate();

  const handleCategoryChange = (
    i: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCategoriesState((currentArrayState) => {
      const newArray = [...currentArrayState]; // 1. copy the array
      newArray[i][1] = event.target.value; // 2. update the index
      return newArray; // 3. return the new array
    });
  };

  const handleWordChange = (
    i: number,
    j: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setCategoriesState((currentArrayState) => {
      const newArray = [...currentArrayState];
      newArray[i][2][j] = event.target.value;
      return newArray;
    });
  };

  return (
    <tr>
      <td colSpan={5} className="p-4 bg-gray-50">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {[
                t("admin.category"),
                t("admin.word1"),
                t("admin.word2"),
                t("admin.word3"),
                t("admin.word4"),
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
                <td className="py-2 px-3">
                  <input
                    type="text"
                    className="w-full"
                    value={category[1]}
                    disabled={!edit}
                    onChange={handleCategoryChange.bind(this, i)}
                  />
                </td>
                {category[2].map((value, j) => (
                  <td key={j} className="py-2 px-3">
                    <input
                      type="text"
                      className="w-full"
                      value={value}
                      disabled={!edit}
                      onChange={handleWordChange.bind(this, i, j)}
                    />
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

const CollapsibleRow = ({
  id,
  publishDate,
  createUpdateDates,
  categories,
}: CollapsibleRowProps) => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const sortCategories = (categories: Category[]): Category[] => {
    return categories.sort((a, b) => (a.level > b.level ? 1 : -1));
  };

  const [categoriesState, setCategoriesState] = useState<CategoriesState[]>(
    sortCategories(categories).map((category) => [
      category.id,
      category.category,
      category.items,
    ]),
  );

  const handleSave = async () => {
    const result = await fetch(`/api/admin`, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        id: id,
        data: {
          publishDate: publishDate,
          categories: categoriesState.map((category, i) => {
            return {
              id: category[0],
              category: category[1],
              items: category[2],
              level: i,
            };
          }),
        },
      }),
    });

    console.log("result", result);
  };

  const { t } = useTranslate();

  return (
    <>
      <tr className="border-b hover:bg-gray-100">
        <td className="py-3 px-4">{id}</td>
        <td className="py-3 px-4">{publishDate.toDateString()}</td>
        {createUpdateDates.map((cell, i) => (
          <td key={i} className="py-3 px-4">
            {cell.toDateString()}
          </td>
        ))}
        <td className="py-3 px-4">
          <button
            onClick={() => setOpen(!open)}
            className="text-blue-600 hover:underline"
          >
            {open ? t("admin.hide") : t("admin.show")}
          </button>
        </td>
      </tr>
      {open && (
        <>
          <tr>
            <td colSpan={5} className="p-4 bg-gray-50">
              {!edit && (
                <button
                  onClick={() => setEdit(!edit)}
                  className="text-blue-600 hover:underline"
                >
                  {t("admin.edit")}
                </button>
              )}
              {edit && (
                <button
                  onClick={() => {
                    handleSave();
                    setEdit(!edit);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {t("admin.save")}
                </button>
              )}
              {edit && (
                <button
                  onClick={() => {
                    setCategoriesState(
                      sortCategories(categories).map((category) => [
                        category.id,
                        category.category,
                        category.items,
                      ]),
                    );
                    setEdit(!edit);
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {t("admin.cancel")}
                </button>
              )}
              {edit && (
                <button
                  onClick={() => setEdit(!edit)}
                  className="text-blue-600 hover:underline"
                >
                  {t("admin.delete")}
                </button>
              )}
            </td>
          </tr>
          <RowDetails
            categories={categoriesState}
            edit={edit}
            setCategoriesState={setCategoriesState}
          />
        </>
      )}
    </>
  );
};

export default function CollapsibleTable({
  connections,
}: CollapsibleTableProps) {
  const { t } = useTranslate();

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded p-4 w-full">
      <table className="w-full min-w-full">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">{t("admin.id")}</th>
            <th className="py-3 px-4 text-left">{t("admin.publishDate")}</th>
            <th className="py-3 px-4 text-left">{t("admin.createDate")}</th>
            <th className="py-3 px-4 text-left">{t("admin.updateDate")}</th>
            <th className="py-3 px-4 text-left">{t("admin.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {connections.map((connection, i) => {
            return (
              <CollapsibleRow
                key={i}
                id={connection.id}
                createUpdateDates={[new Date(), new Date()]}
                publishDate={connection.publishDate}
                categories={connection.categories}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
