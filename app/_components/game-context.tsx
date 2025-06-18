"use client";

import { createContext, useState, useEffect, useMemo } from "react";
import { Word, Category, SubmitResult } from "@/app/_types";
import { delay, generateHashFromArray, shuffleArray } from "@/app/_utils";
import * as Sentry from "@sentry/nextjs";

type GameContextType = {
  setTodaysCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  gameWords: Word[];
  setGameWords: React.Dispatch<React.SetStateAction<Word[]>>;
  selectedWords: Word[];
  clearedCategories: Category[];
  mistakesRemaining: number;
  isWon: boolean;
  isLost: boolean;
  guessHistory: Word[][];
  selectWord: (word: Word) => void;
  shuffleWords: () => void;
  deselectAllWords: () => void;
  getSubmitResult: () => SubmitResult;
  handleLoss: () => Promise<void>;
  handleWin: () => Promise<void>;
} | null; // Add `| null` if you may be using a default null value.

export const GameContext = createContext<GameContextType>(null);

type GameContextProviderProps = {
  children: React.ReactNode;
};

export function GameContextProvider(props: GameContextProviderProps) {
  const [todaysCategories, setTodaysCategories] = useState<Category[]>([]);

  const [guessHistory, setGuessHistory] = useState<Word[][]>([]);
  const [clearedCategories, setClearedCategories] = useState<Category[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [mistakesRemaining, setMistakesRemaning] = useState(4);
  const [gameWords, setGameWords] = useState<Word[]>([]);

  const selectedWords = useMemo(
    () => gameWords.filter((item) => item.selected),
    [gameWords],
  );

  useEffect(() => {
    if (todaysCategories.length > 0) {
      const words: Word[] = todaysCategories
        .map((category) =>
          category.items.map((word) => ({ word: word, level: category.level })),
        )
        .flat();
      setGameWords(shuffleArray(words));
    }
  }, [todaysCategories]);

  useEffect(() => {
    const loadDataFromLocalStorage = async () => {
      const hash = await generateHashFromArray(todaysCategories);
      try {
        const activeGameString = localStorage.getItem("activeGame");
        if (!activeGameString) return;
        const activeGame = JSON.parse(activeGameString);
        if (activeGame.hash !== hash) return;
        const {
          guessHistory,
          clearedCategories,
          isWon,
          isLost,
          mistakesRemaining,
          gameWords,
        } = activeGame.data;
        setGuessHistory(guessHistory);
        setClearedCategories(clearedCategories);
        setIsWon(isWon);
        setIsLost(isLost);
        setMistakesRemaning(mistakesRemaining);
        setGameWords(gameWords);
      } catch (error) {
        console.log("loading localStorage error", error);
        Sentry.captureException(error);
      }
    };
    if (todaysCategories.length > 0) loadDataFromLocalStorage();
  }, [todaysCategories]);

  useEffect(() => {
    const saveDataToLocalStorage = async () => {
      const hash = await generateHashFromArray(todaysCategories);

      console.log("hash", hash, todaysCategories);
      localStorage.setItem(
        "activeGame",
        JSON.stringify({
          hash,
          data: {
            guessHistory,
            clearedCategories,
            isWon,
            isLost,
            mistakesRemaining,
            gameWords: gameWords.map((word) => ({ ...word, selected: false })),
          },
        }),
      );
    };
    if (todaysCategories.length > 0) saveDataToLocalStorage();
  }, [
    guessHistory,
    clearedCategories,
    isWon,
    isLost,
    mistakesRemaining,
    gameWords,
  ]);

  const selectWord = (word: Word): void => {
    const newGameWords = gameWords.map((item) => {
      // Only allow word to be selected if there are less than 4 selected words
      if (word.word === item.word) {
        return {
          ...item,
          selected: selectedWords.length < 4 ? !item.selected : false,
        };
      } else {
        return item;
      }
    });

    setGameWords(newGameWords);
  };

  const shuffleWords = () => {
    setGameWords([...shuffleArray(gameWords)]);
  };

  const deselectAllWords = () => {
    setGameWords(
      gameWords.map((item) => {
        return { ...item, selected: false };
      }),
    );
  };

  const getSubmitResult = (): SubmitResult => {
    const sameGuess = guessHistory.some((guess) =>
      guess.every((word) => selectedWords.includes(word)),
    );

    if (sameGuess) {
      console.log("Same!");
      return { result: "same" };
    }

    setGuessHistory((prevGuessHistory) => [...prevGuessHistory, selectedWords]);

    const likenessCounts = todaysCategories.map((category) => {
      return selectedWords.filter((item) => category.items.includes(item.word))
        .length;
    });

    const maxLikeness = Math.max(...likenessCounts);
    const maxIndex = likenessCounts.indexOf(maxLikeness);

    if (maxLikeness === 4) {
      return getCorrectResult(todaysCategories[maxIndex]);
    } else {
      return getIncorrectResult(maxLikeness);
    }
  };

  const getCorrectResult = (category: Category): SubmitResult => {
    setClearedCategories([...clearedCategories, category]);
    setGameWords(
      gameWords.filter((item) => !category.items.includes(item.word)),
    );

    if (clearedCategories.length === 3) {
      return { result: "win" };
    } else {
      return { result: "correct" };
    }
  };

  const getIncorrectResult = (maxLikeness: number): SubmitResult => {
    setMistakesRemaning(mistakesRemaining - 1);

    if (mistakesRemaining === 1) {
      return { result: "loss" };
    } else if (maxLikeness === 3) {
      return { result: "one-away" };
    } else {
      return { result: "incorrect" };
    }
  };

  const handleLoss = async () => {
    const remainingCategories = todaysCategories.filter(
      (category) => !clearedCategories.includes(category),
    );

    deselectAllWords();

    for (const category of remainingCategories) {
      await delay(1000);
      setClearedCategories((prevClearedCategories) => [
        ...prevClearedCategories,
        category,
      ]);
      setGameWords((prevGameWords) =>
        prevGameWords.filter((item) => !category.items.includes(item.word)),
      );
    }

    await delay(1000);
    setIsLost(true);
  };

  const handleWin = async () => {
    await delay(1000);
    setIsWon(true);
  };

  return (
    <GameContext.Provider
      value={{
        setTodaysCategories,
        gameWords,
        setGameWords,
        selectedWords,
        clearedCategories,
        mistakesRemaining,
        isWon,
        isLost,
        guessHistory,
        selectWord,
        shuffleWords,
        deselectAllWords,
        getSubmitResult,
        handleLoss,
        handleWin,
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
}
