"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ConnectionState } from "@/app/[locale]/_types";
import { updateConnectionState } from "../_actions/connections";

export default function StateTransitionButton({
  connectionId,
  currentState,
  publishDate,
}: {
  connectionId: number;
  currentState: ConnectionState;
  publishDate: Date | null;
}) {
  const t = useTranslations();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [chosenDate, setChosenDate] = useState("");
  const [loading, setLoading] = useState(false);

  const transition = async (newState: ConnectionState, date?: string) => {
    setLoading(true);
    try {
      const result = await updateConnectionState(connectionId, newState, date);
      if (result.error) {
        alert(result.error);
      }
    } catch {
      alert(t("admin_stateUpdateError"));
    } finally {
      setLoading(false);
    }
  };

  const handleAdvanceToPublished = () => {
    if (publishDate) {
      transition(ConnectionState.PUBLISHED);
    } else {
      setChosenDate("");
      dialogRef.current?.showModal();
    }
  };

  const handleDialogConfirm = async () => {
    if (!chosenDate) return;
    dialogRef.current?.close();
    await transition(ConnectionState.PUBLISHED, chosenDate);
  };

  return (
    <>
      {currentState === ConnectionState.DRAFT && (
        <button
          onClick={() => transition(ConnectionState.REVIEW)}
          disabled={loading}
          className="px-2 py-0.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          {t("admin_advanceToReview")}
        </button>
      )}

      {currentState === ConnectionState.REVIEW && (
        <>
          <button
            onClick={() => transition(ConnectionState.DRAFT)}
            disabled={loading}
            className="px-2 py-0.5 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50"
          >
            {t("admin_degradeToDraft")}
          </button>
          <button
            onClick={handleAdvanceToPublished}
            disabled={loading}
            className="px-2 py-0.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {t("admin_advanceToPublished")}
          </button>
        </>
      )}

      {currentState === ConnectionState.PUBLISHED && (
        <button
          onClick={() => transition(ConnectionState.REVIEW)}
          disabled={loading}
          className="px-2 py-0.5 text-xs bg-gray-400 text-white rounded hover:bg-gray-500 disabled:opacity-50"
        >
          {t("admin_degradeToReview")}
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 shadow-xl backdrop:bg-black/40 w-80"
      >
        <p className="text-sm mb-3">{t("admin_choosePublishDate")}</p>
        <input
          type="date"
          value={chosenDate}
          onChange={(e) => setChosenDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm w-full mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => dialogRef.current?.close()}
            className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            {t("admin_cancel")}
          </button>
          <button
            onClick={handleDialogConfirm}
            disabled={!chosenDate}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {t("admin_confirmPublish")}
          </button>
        </div>
      </dialog>
    </>
  );
}
