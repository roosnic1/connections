"use client";

import React from "react";
import GuessHistory from "@/app/_components/guess-history";
import ControlButton from "@/app/_components/button/control-button";
import { Word } from "@/app/_types";
import { useTranslations } from "next-intl";
import { getWordEmoji } from "@/app/_utils";

type GameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isWon: boolean;
  guessHistory: Word[][];
  perfection: string;
};

export default function GameModal(props: GameModalProps) {
  // dialog ref
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  // Open close
  React.useEffect(() => {
    if (props.isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [props.isOpen]);

  // If clicked outside bounding rect, close
  const handleClickOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    const boundingBox = dialogRef.current?.getBoundingClientRect();
    if (!boundingBox) return;

    if (
      e.clientX < boundingBox?.left ||
      e.clientX > boundingBox?.right ||
      e.clientY < boundingBox?.top ||
      e.clientY > boundingBox?.bottom
    ) {
      props.onClose();
    }
  };

  const handleShare = async () => {
    const resultsEmojiis = props.guessHistory
      .map((words) => {
        return `${words.map((word) => getWordEmoji(word.level)).join("")}\n`;
      })
      .join("");
    if (navigator.share) {
      try {
        await navigator.share({
          text: `Connections \n${resultsEmojiis}`,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      alert("Sharing not supported in this browser.");
    }
  };

  const t = useTranslations("HomePage");

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClickOutside}
      className={`backdrop:bg-black backdrop:opacity-75 rounded-md p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] w-full sm:w-[500px]`}
    >
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-black text-4xl font-black my-4 ml-4">
          {props.perfection}
        </h1>
        <hr className="mb-2 md:mb-4 w-full"></hr>
        <h2 className="text-black mb-8">
          {props.isWon ? t("wonGame") : t("lostGame")}
        </h2>
        <GuessHistory guessHistory={props.guessHistory} />
        <div className="flex gap-2 mb-12">
          <ControlButton text={t("share")} onClick={handleShare} />
          <ControlButton text={t("close")} onClick={props.onClose} />
        </div>
      </div>
    </dialog>
  );
}
