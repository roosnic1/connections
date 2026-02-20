"use client";

import React, { useContext } from "react";
import GuessHistory from "@/app/[locale]/_components/guess-history";
import ControlButton from "@/app/[locale]/_components/button/control-button";
import { getPerfection, getWordEmoji } from "@/app/[locale]/_utils";
import { GameContext } from "@/app/[locale]/_components/game-context";
import { useTranslations } from "next-intl";

type GameModalProps = {
  isOpen: boolean;
  onClose: () => void;
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

  const t = useTranslations();
  const gameContext = useContext(GameContext);
  if (!gameContext)
    throw new Error(
      "GameContext is not provided. Make sure you wrap your app in <GameContextProvider>",
    );
  const { guessHistory, mistakesRemaining, isWon } = gameContext;

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
    const resultsEmojiis = guessHistory
      .map((words: any[]) => {
        return `${words.map((word) => getWordEmoji(word.level)).join("")}\n`;
      })
      .join("");
    if (navigator.share) {
      try {
        await navigator.share({
          text: `${t("HomePage_shareText")} \n${resultsEmojiis}`,
        });
        console.log("Shared successfully");
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      alert(t("HomePage_shareNotSupported"));
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleClickOutside}
      className={`backdrop:bg-black backdrop:opacity-75 rounded-md p-8 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90%] w-full sm:w-[500px]`}
    >
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-black text-4xl font-black my-4 ml-4">
          {getPerfection(mistakesRemaining)}
        </h1>
        <hr className="mb-2 md:mb-4 w-full"></hr>
        <h2 className="text-black mb-8">
          {isWon ? t("HomePage_wonGame") : t("HomePage_lostGame")}
        </h2>
        <GuessHistory guessHistory={guessHistory} />
        <div className="flex gap-2 mb-12">
          <ControlButton text={t("HomePage_share")} onClick={handleShare} />
          <ControlButton text={t("HomePage_close")} onClick={props.onClose} />
        </div>
      </div>
    </dialog>
  );
}
