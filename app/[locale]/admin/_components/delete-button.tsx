"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { deleteConnection } from "../_actions/connections";

export default function DeleteButton({
  connectionId,
}: {
  connectionId: number;
}) {
  const t = useTranslations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(t("admin_deleteConfirm"))) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteConnection(connectionId);
    } catch {
      toast(t("admin_deleteError"));
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-2 py-0.5 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
    >
      {t("admin_delete")}
    </button>
  );
}
