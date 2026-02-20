import { Word } from "../_types";
import { getWordColor } from "../_utils";

type GuessHistoryProps = {
  guessHistory: Word[][];
  showWords?: boolean;
};

export default function GuessHistory(props: GuessHistoryProps) {
  return (
    <div
      className={`grid grid-cols-4 mb-12 ${
        props.showWords ? "gap-1" : "gap-y-1 w-fit mx-auto"
      }`}
    >
      {props.guessHistory.map((guesses, rowIndex) =>
        guesses.map((word, index) => (
          <div
            key={`${rowIndex}-${index}`}
            className={`rounded-md ${getWordColor(word.level)} ${
              props.showWords
                ? "px-2 py-3 text-xs font-semibold text-center flex items-center justify-center"
                : "size-12"
            }`}
          >
            {props.showWords && word.word}
          </div>
        )),
      )}
    </div>
  );
}
