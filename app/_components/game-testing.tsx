"use client";

import { useContext, useEffect, useState } from "react";
import { ConnectionGame } from "../_types";
import { useTranslations } from "next-intl";
import { GameContext } from "@/app/_components/game-context";
import Game from "@/app/_components/game";
import ControlButton from "@/app/_components/button/control-button";

type GameTestingProps = {
  games: ConnectionGame[];
};

type ConnectionGameOrNull = ConnectionGame | null;
type AlreadyTestedIDsOrNull = number[] | null;

export default function GameTesting(props: GameTestingProps) {
  const gameContext = useContext(GameContext);
  if (!gameContext)
    throw new Error(
      "GameContext is not provided. Make sure you wrap your app in <GameContextProvider>",
    );
  const { isWon, isLost } = gameContext;

  const [games] = useState<ConnectionGame[]>(props.games);
  const [game, setGame] = useState<ConnectionGameOrNull>(null);
  const [alreadyTestedIDs, setAlreadyTestedIDs] =
    useState<AlreadyTestedIDsOrNull>(null);

  const getAlreadyTestedIDsFromLocalStorage = () => {
    const ids = localStorage.getItem("alreadyTestedIDs");
    if (!ids) return [];
    return JSON.parse(ids);
  };

  useEffect(() => {
    setAlreadyTestedIDs(getAlreadyTestedIDsFromLocalStorage());
  }, []);

  const selectRandomGame = () => {
    if (alreadyTestedIDs === null || games.length === 0) return;
    const testedIDs = alreadyTestedIDs.length > 0 ? alreadyTestedIDs : [];
    if (games.length > 0) {
      const filteredGames = games.filter(
        (game) => !testedIDs.includes(game.id),
      );
      const game =
        filteredGames[Math.floor(Math.random() * filteredGames.length)];
      setGame(game as ConnectionGame);
    }
  };

  useEffect(() => {
    if (game === null && alreadyTestedIDs !== null) selectRandomGame();
  }, [game, alreadyTestedIDs]);

  useEffect(() => {
    if ((isWon || isLost) && game && alreadyTestedIDs !== null) {
      const updatedAlreadyTestedIDs = [...alreadyTestedIDs, game.id];
      localStorage.setItem(
        "alreadyTestedIDs",
        JSON.stringify(updatedAlreadyTestedIDs),
      );
      setAlreadyTestedIDs(updatedAlreadyTestedIDs);
    }
  }, [isWon, isLost]);

  const handleNewGame = () => {
    selectRandomGame();
  };

  const t = useTranslations("testing");

  return (
    <>
      {!game && (
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">
          {t("noGamesToTest")}
        </h1>
      )}
      {game && (
        <Game
          game={game}
          saveDataToLocalStorage={false}
          extraButtons={[
            <ControlButton
              key="new-game-button"
              text={t("newGame")}
              onClick={handleNewGame}
            />,
          ]}
        />
      )}
    </>
  );
}
