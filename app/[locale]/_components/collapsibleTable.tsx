"use client";
import { useEffect, useState } from "react";
import {
  CategoriesState,
  Category,
  ConnectionGame,
  createOrUpdateConnectionActionParams,
} from "@/app/[locale]/_types";
import { useTranslate } from "@tolgee/react";
import AdminControlButton from "@/app/[locale]/_components/button/admin-control-button";
import DatePicker from "@/app/[locale]/_components/button/date-picker";

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
  cancelAddNew: () => void;
  createOrUpdateConnectionAction: (
    params: createOrUpdateConnectionActionParams,
  ) => void;
  deleteConnectionAction: (id: number) => void;
};

type CollapsibleTableProps = {
  connections: ConnectionGame[];
  createOrUpdateConnectionAction: (
    data: createOrUpdateConnectionActionParams,
  ) => void;
  deleteConnectionAction: (id: number) => void;
};

const NEW_GAME_CATEGORIES: Category[] = [
  { id: -1, category: "", items: ["", "", "", ""], level: 1 },
  { id: -1, category: "", items: ["", "", "", ""], level: 2 },
  { id: -1, category: "", items: ["", "", "", ""], level: 3 },
  { id: -1, category: "", items: ["", "", "", ""], level: 4 },
];

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
  cancelAddNew,
  createOrUpdateConnectionAction,
  deleteConnectionAction,
}: CollapsibleRowProps) => {
  const [edit, setEdit] = useState(id < 0);

  useEffect(() => {
    setEdit(id < 0);
  }, [id]);

  const sortCategories = (categories: Category[]): Category[] => {
    return categories.sort((a, b) => (a.level > b.level ? 1 : -1));
  };

  const [publishingDate, setPublishingDate] = useState<Date>(publishDate);

  useEffect(() => {
    setPublishingDate(publishDate);
  }, [publishDate]);

  const [categoriesState, setCategoriesState] = useState<CategoriesState[]>(
    sortCategories(categories).map((category) => [
      category.id,
      category.category,
      category.items,
    ]),
  );

  useEffect(() => {
    setCategoriesState(
      sortCategories(categories).map((category) => [
        category.id,
        category.category,
        category.items,
      ]),
    );
  }, [categories]);

  const { t } = useTranslate();

  return (
    <>
      <tr className="border-b hover:bg-gray-100">
        <td className="py-3 px-4">{id}</td>
        <td className="py-3 px-4">
          <DatePicker
            date={publishingDate}
            onChange={(date) => setPublishingDate(date)}
            unclickable={!edit}
          />
        </td>
        {createUpdateDates.map((cell, i) => (
          <td key={i} className="py-3 px-4">
            {cell.toDateString()}
          </td>
        ))}
        <td className="py-3 px-4">
          <AdminControlButton
            text={edit ? t("admin.cancel") : t("admin.edit")}
            onClick={() => {
              if (edit) {
                cancelAddNew();
                setCategoriesState(
                  sortCategories(categories).map((category) => [
                    category.id,
                    category.category,
                    category.items,
                  ]),
                );
                setEdit(!edit);
              } else {
                setEdit(!edit);
              }
            }}
          />
          <AdminControlButton
            text={t("admin.delete")}
            onClick={() => {
              deleteConnectionAction(id);
            }}
            unclickable={edit}
          />
        </td>
      </tr>

      <RowDetails
        categories={categoriesState}
        edit={edit}
        setCategoriesState={setCategoriesState}
      />
      <tr>
        <td colSpan={5} className="px-3 py-1 ">
          <div className="flex justify-end w-full pr-2">
            <AdminControlButton
              onClick={() => {
                createOrUpdateConnectionAction({
                  id,
                  publishingDate,
                  categoriesState,
                });
                setEdit(!edit);
              }}
              unclickable={!edit}
              text={t("admin.save")}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default function CollapsibleTable({
  connections,
  createOrUpdateConnectionAction,
  deleteConnectionAction,
}: CollapsibleTableProps) {
  const { t } = useTranslate();

  const [connectionsState, setConnectionsState] =
    useState<ConnectionGame[]>(connections);

  useEffect(() => {
    setConnectionsState(connections);
  }, [connections]);

  const handleAddNew = () => {
    if (connectionsState.length > 0 && connectionsState[0].id !== -1) {
      setConnectionsState([
        {
          id: -1,
          publishDate: new Date(),
          categories: NEW_GAME_CATEGORIES,
        },
        ...connectionsState,
      ]);
    }
  };

  const handleCancelAddNew = () => {
    if (connectionsState.length > 0 && connectionsState[0].id === -1) {
      setConnectionsState([...connectionsState.splice(1)]);
    }
  };

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
          <tr>
            <td colSpan={5} className="px-3 py-1 ">
              <AdminControlButton
                text={t("admin.addNew")}
                onClick={handleAddNew}
              />
            </td>
          </tr>
          {connectionsState.map((connection, i) => {
            return (
              <CollapsibleRow
                key={i}
                id={connection.id}
                createUpdateDates={[new Date(), new Date()]}
                publishDate={connection.publishDate}
                categories={connection.categories}
                cancelAddNew={handleCancelAddNew}
                createOrUpdateConnectionAction={createOrUpdateConnectionAction}
                deleteConnectionAction={deleteConnectionAction}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
