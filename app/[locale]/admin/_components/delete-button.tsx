"use client";

import { useTranslations } from "next-intl";
import { deleteConnection } from "../_actions/connections";

export default function DeleteButton({
  connectionId,
}: {
  connectionId: number;
}) {
  const t = useTranslations();

  const handleDelete = async () => {
    if (!window.confirm(t("admin_deleteConfirm"))) {
      return;
    }
    await deleteConnection(connectionId);
  };

  return (
    <button
      onClick={handleDelete}
      className="px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600"
    >
      {t("admin_delete")}
    </button>
  );
}
