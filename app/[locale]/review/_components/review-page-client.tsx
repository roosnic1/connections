"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { ConnectionGame, Word } from "@/app/[locale]/_types";
import Game from "@/app/[locale]/_components/game";
import ReviewModal from "./review-modal";
import { useTranslations } from "next-intl";
import { GameContext } from "@/app/[locale]/_components/game-context";

const REVIEWED_GAMES_KEY = "reviewedGames";

type ReviewPageClientProps = {
  connections: ConnectionGame[];
};

export default function ReviewPageClient(props: ReviewPageClientProps) {
  const t = useTranslations();
  const gameContext = useContext(GameContext);
  const [currentGame, setCurrentGame] = useState<ConnectionGame | null>(null);
  const [gamesLeft, setGamesLeft] = useState(0);
  const [allDone, setAllDone] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [gameOverIsWon, setGameOverIsWon] = useState(false);
  const [gameOverGuessHistory, setGameOverGuessHistory] = useState<Word[][]>(
    [],
  );
  const contextFreshRef = useRef(false);

  const getReviewedIds = (): number[] => {
    try {
      const raw = localStorage.getItem(REVIEWED_GAMES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const pickNextGame = (reviewedIds: number[]): ConnectionGame | null => {
    const unreviewed = props.connections.filter(
      (c) => !reviewedIds.includes(c.id),
    );
    if (unreviewed.length === 0) return null;
    return unreviewed[Math.floor(Math.random() * unreviewed.length)];
  };

  useEffect(() => {
    const reviewedIds = getReviewedIds();
    const unreviewed = props.connections.filter(
      (c) => !reviewedIds.includes(c.id),
    );

    if (unreviewed.length === 0) {
      setAllDone(true);
    } else {
      const game = unreviewed[Math.floor(Math.random() * unreviewed.length)];
      setCurrentGame(game);
      setGamesLeft(unreviewed.length);
    }
    setLoaded(true);
  }, [props.connections]);

  useEffect(() => {
    if (!gameContext || !currentGame || showReviewModal) return;
    const { isWon, isLost, guessHistory } = gameContext;
    if (!isWon && !isLost) {
      contextFreshRef.current = true;
      return;
    }
    if (contextFreshRef.current) {
      contextFreshRef.current = false;
      setGameOverIsWon(isWon);
      setGameOverGuessHistory(guessHistory);
      setShowReviewModal(true);
    }
  }, [
    gameContext?.isWon,
    gameContext?.isLost,
    gameContext?.guessHistory,
    currentGame,
    showReviewModal,
  ]);

  const handleReviewSubmitted = () => {
    if (!currentGame) return;

    const reviewedIds = getReviewedIds();
    const updatedIds = [...reviewedIds, currentGame.id];
    try {
      localStorage.setItem(REVIEWED_GAMES_KEY, JSON.stringify(updatedIds));
    } catch {
      // Storage full or unavailable — continue without persisting
    }

    setShowReviewModal(false);
    contextFreshRef.current = false;

    const next = pickNextGame(updatedIds);
    if (!next) {
      setAllDone(true);
      setCurrentGame(null);
      setGamesLeft(0);
    } else {
      const remaining = props.connections.filter(
        (c) => !updatedIds.includes(c.id),
      ).length;
      setCurrentGame(next);
      setGamesLeft(remaining);
    }
  };

  if (!loaded) return null;

  if (props.connections.length === 0 || allDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 mt-24 px-4 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="text-2xl font-bold text-black">
          {t("review_allDoneTitle")}
        </h2>
        <p className="text-gray-500 max-w-sm">
          {t("review_allDoneDescription")}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-amber-50 border-b border-amber-200 py-2 px-4 text-center text-sm text-amber-800">
        {t("review_banner", { count: gamesLeft })}
      </div>

      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-12">
        {currentGame && (
          <>
            <Game
              key={currentGame.id}
              game={currentGame}
              saveDataToLocalStorage={false}
              onGameOver={() => {}}
            />
            <ReviewModal
              isOpen={showReviewModal}
              connectionId={currentGame.id}
              isWon={gameOverIsWon}
              guessHistory={gameOverGuessHistory}
              onSubmitted={handleReviewSubmitted}
            />
          </>
        )}
      </div>
    </>
  );
}
