"use client";

import { useCallback, useContext, useState } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import useAnimation from "./_hooks/use-animation";
import { Category, CellAnimationState, SubmitResult, Word } from "./_types";
import { getPerfection } from "./_utils";
import { useTranslations } from "next-intl";
import GameModal from "@/app/_components/modal/game-modal";
import { toast } from "react-toastify";
import { GameContext } from "@/app/_components/game-context";

type GameProps = {
  categories: Category[];
};

export default function Game(props: GameProps) {
  const gameContext = useContext(GameContext);
  if (!gameContext)
    throw new Error(
      "GameContext is not provided. Make sure you wrap your app in <GameContextProvider>",
    );
  const {
    setTodaysCategories,
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    isWon,
    isLost,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleWin,
    handleLoss,
  } = gameContext;

  setTodaysCategories(props.categories);

  const [showGameModal, setShowGameModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  } = useAnimation();

  const t = useTranslations("HomePage");

  const handleSubmit = async () => {
    setSubmitted(true);
    await animateGuess(selectedWords);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case "same":
        toast(t("alreadyGuessed"));
        //showPopup(t("alreadyGuessed"));
        break;
      case "one-away":
        animateWrongGuess();
        toast(t("oneAway"));
        break;
      case "loss":
        toast(t("betterLuck"));
        await handleLoss();
        setShowGameModal(true);
        break;
      case "win":
        toast(getPerfection(mistakesRemaining));
        await handleWin();
        setShowGameModal(true);
        break;
      case "incorrect":
        animateWrongGuess();
        break;
    }
    setSubmitted(false);
  };

  const onClickCell = useCallback(
    (word: Word) => {
      selectWord(word);
    },
    [selectWord],
  );

  const renderControlButtons = () => {
    const showResultsButton = (
      <ControlButton
        text={t("showResults")}
        onClick={() => setShowGameModal(true)}
        unclickable={submitted}
      />
    );

    const inProgressButtons = (
      <div className="flex gap-2 mb-12">
        <ControlButton
          text={t("shuffle")}
          onClick={shuffleWords}
          unclickable={submitted}
        />
        <ControlButton
          text={t("clear")}
          onClick={deselectAllWords}
          unclickable={selectedWords.length === 0 || submitted}
        />
        <ControlButton
          text={t("submit")}
          unclickable={selectedWords.length !== 4 || submitted}
          onClick={handleSubmit}
        />
      </div>
    );

    if (isWon || isLost) {
      return showResultsButton;
    } else {
      return inProgressButtons;
    }
  };

  return (
    <>
      <div className="min-w-full sm:min-w-[630px]">
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">
          {t("title")}
        </h1>
        <h1 className="text-black mb-4">{t("subtitle")}</h1>
        <hr className="mb-4 md:mb-4 w-full"></hr>
        <div className="relative w-full">
          <Grid
            words={gameWords}
            selectedWords={selectedWords}
            onClick={onClickCell}
            clearedCategories={clearedCategories}
            guessAnimationState={guessAnimationState}
            wrongGuessAnimationState={wrongGuessAnimationState}
          />
        </div>
        <h2 className="text-black my-4 md:my-8 mx-8">
          {t("mistakesRemaining", {
            count:
              mistakesRemaining > 0
                ? Array(mistakesRemaining).fill("•").join("")
                : "",
          })}
        </h2>
        {renderControlButtons()}
      </div>
      <GameModal
        isOpen={showGameModal}
        onClose={() => setShowGameModal(false)}
      />
    </>
  );
}
