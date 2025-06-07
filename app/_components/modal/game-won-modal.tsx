import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";
import { useTranslations } from "next-intl";

type GameWonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
  perfection: string;
};

export default function GameWonModal(props: GameWonModalProps) {
  const t = useTranslations("HomePage");

  return (
    <GameModal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-black text-4xl font-black my-4 ml-4">
          {props.perfection}
        </h1>
        <hr className="mb-2 md:mb-4 w-full"></hr>
        <h2 className="text-black mb-8">{t("tagline")}</h2>
        <GuessHistory guessHistory={props.guessHistory} />
        <ControlButton text={t("clear")} onClick={props.onClose} />
      </div>
    </GameModal>
  );
}