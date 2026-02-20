"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Word } from "@/app/[locale]/_types";
import GuessHistory from "@/app/[locale]/_components/guess-history";

type ReviewModalProps = {
  isOpen: boolean;
  connectionId: number;
  isWon: boolean;
  guessHistory: Word[][];
  onSubmitted: () => void;
};

export default function ReviewModal(props: ReviewModalProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const t = useTranslations();

  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem("reviewerName");
    if (savedName) setName(savedName);
  }, []);

  useEffect(() => {
    if (props.isOpen) {
      setDifficulty(null);
      setComment("");
      setError(null);
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [props.isOpen]);

  const handleSubmit = async () => {
    if (!name.trim() || difficulty === null) return;
    setSubmitting(true);
    setError(null);

    localStorage.setItem("reviewerName", name.trim());

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId: props.connectionId,
          reviewerName: name.trim(),
          difficulty,
          comment: comment.trim() || null,
          isWon: props.isWon,
          guessHistory: props.guessHistory,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      props.onSubmitted();
    } catch {
      setError(t("review_modal_error"));
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    name.trim().length > 0 && difficulty !== null && !submitting;

  return (
    <dialog
      ref={dialogRef}
      className="backdrop:bg-black backdrop:opacity-75 rounded-md p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] w-full sm:w-[500px]"
    >
      <div className="flex flex-col gap-5">
        <div className="text-center">
          <h1 className="text-black text-2xl font-black">
            {props.isWon
              ? t("review_modal_wonTitle")
              : t("review_modal_lostTitle")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {t("review_modal_subtitle")}
          </p>
        </div>

        <GuessHistory guessHistory={props.guessHistory} showWords />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            {t("review_modal_nameLabel")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            maxLength={50}
            placeholder={t("review_modal_namePlaceholder")}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-black">
            {t("review_modal_difficultyLabel")}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setDifficulty(n)}
                className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${
                  difficulty === n
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-700 hover:border-black"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 px-1">
            <span>{t("review_modal_difficultyEasy")}</span>
            <span>{t("review_modal_difficultyHard")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-black">
            {t("review_modal_commentLabel")}{" "}
            <span className="text-gray-400 font-normal">
              {t("review_modal_commentOptional")}
            </span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 1000))}
            maxLength={1000}
            placeholder={t("review_modal_commentPlaceholder")}
            rows={3}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          <span className="text-xs text-gray-400 text-right">
            {t("review_modal_charsLeft", { count: 1000 - comment.length })}
          </span>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`w-full py-3 rounded-full font-medium text-sm transition-opacity ${
            canSubmit
              ? "bg-black text-white hover:opacity-80"
              : "bg-gray-200 text-gray-400 pointer-events-none"
          }`}
        >
          {submitting ? t("review_modal_submitting") : t("review_modal_submit")}
        </button>
      </div>
    </dialog>
  );
}
