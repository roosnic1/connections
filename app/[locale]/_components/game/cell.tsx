"use client";

import { Word } from "@/app/[locale]/_types";

type CellProps = {
  cellValue: Word;
  onClick: (word: Word) => void;
  animateGuess: boolean;
  animateWrongGuess: boolean;
};

export default function Cell(props: CellProps) {
  const bgColor = props.cellValue.selected ? "bg-slate-500" : "bg-slate-200";
  const textColor = props.cellValue.selected ? "text-stone-100" : "text-black";

  const handleClick = () => {
    props.onClick(props.cellValue);
  };

  const guessAnimation = props.animateGuess ? "transform -translate-y-2" : "";
  const wrongGuessAnimation = props.animateWrongGuess
    ? "animate-horizontal-shake"
    : "";

  return (
    <button
      className={`${bgColor} aspect-square flex items-center justify-center rounded-md px-1 cursor-pointer transition ease-in-out ${guessAnimation} ${wrongGuessAnimation}`}
      onClick={handleClick}
    >
      <span
        className={`${textColor} text-xs md:text-lg text-center font-bold w-full break-words hyphens-auto`}
      >
        {props.cellValue.word.toUpperCase().replace(/\|/g, "\u00AD")}
      </span>
    </button>
  );
}
