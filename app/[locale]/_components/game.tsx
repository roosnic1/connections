"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import ControlButton from "./button/control-button";
import Grid from "./game/grid";
import useAnimation from "../_hooks/use-animation";
import {
  CellAnimationState,
  ConnectionGame,
  SubmitResult,
  Word,
} from "../_types";
import { getPerfection } from "../_utils";
import GameModal from "@/app/[locale]/_components/modal/game-modal";
import { toast } from "react-toastify";
import { GameContext } from "@/app/[locale]/_components/game-context";
import { DateTime } from "luxon";
import { useTranslate } from "@tolgee/react";

type GameProps = {
  game: ConnectionGame;
  saveDataToLocalStorage?: boolean;
  extraButtons?: [React.ReactNode];
};

export default function Game(props: GameProps) {
  const gameContext = useContext(GameContext);
  if (!gameContext)
    throw new Error(
      "GameContext is not provided. Make sure you wrap your app in <GameContextProvider>",
    );
  const {
    setTodaysCategories,
    setUseLocalStorageData,
    publishDate,
    setPublishDate,
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

  useEffect(() => {
    setTodaysCategories(props.game.categories);
    setPublishDate(DateTime.fromJSDate(props.game.publishDate));
    props.saveDataToLocalStorage !== undefined &&
      setUseLocalStorageData(props.saveDataToLocalStorage);
  }, [props.game]);

  const [showGameModal, setShowGameModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  } = useAnimation();

  const { t } = useTranslate();

  const handleSubmit = async () => {
    setSubmitted(true);
    await animateGuess(selectedWords);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case "same":
        toast(t("HomePage.alreadyGuessed"));
        //showPopup(t("alreadyGuessed"));
        break;
      case "one-away":
        animateWrongGuess();
        toast(t("HomePage.oneAway"));
        break;
      case "loss":
        toast(t("HomePage.betterLuck"));
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
        text={t("HomePage.showResults")}
        onClick={() => setShowGameModal(true)}
        unclickable={submitted}
      />
    );

    const inProgressButtons = (
      <>
        <ControlButton
          text={t("HomePage.shuffle")}
          onClick={shuffleWords}
          unclickable={submitted}
        />
        <ControlButton
          text={t("HomePage.clear")}
          onClick={deselectAllWords}
          unclickable={selectedWords.length === 0 || submitted}
        />
        <ControlButton
          text={t("HomePage.submit")}
          unclickable={selectedWords.length !== 4 || submitted}
          onClick={handleSubmit}
        />
      </>
    );

    /*if (isWon || isLost) {
      return showResultsButton;
    } else {
      return inProgressButtons;
    }*/

    return (
      <div className="flex gap-2 mb-12">
        {(isWon || isLost) && showResultsButton}
        {!isWon && !isLost && inProgressButtons}
        <div className="ml-3"></div>
        {props.extraButtons &&
          props.extraButtons.length > 0 &&
          props.extraButtons.map((button) => button)}
      </div>
    );
  };

  return (
    <>
      <div className="min-w-full sm:min-w-[630px]">
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">
          {t("HomePage.title", {
            day: `${publishDate.setLocale("de-CH").toLocaleString(DateTime.DATE_SHORT)}`,
          })}
        </h1>
        <h1 className="text-black mb-4">{t("HomePage.subtitle")}</h1>
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
          {t("HomePage.mistakesRemaining", {
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
