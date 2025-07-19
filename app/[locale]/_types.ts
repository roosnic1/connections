export type Category = {
  category: string;
  items: string[];
  level: 1 | 2 | 3 | 4;
};

export type Word = {
  word: string;
  level: 1 | 2 | 3 | 4;
  selected?: boolean;
};

export type ConnectionGame = {
  id: number;
  publishDate: Date;
  categories: Category[];
};

export type SubmitResultType =
  | "correct"
  | "incorrect"
  | "same"
  | "one-away"
  | "loss"
  | "win";

export type SubmitResult = {
  result: SubmitResultType;
};

export type CellAnimationState = {
  show: boolean;
  index: number;
};

export type LocalStorageGame = {
  hash: string;
  publishDate: string;
  mistakesRemaining: number;
  gameWords: Word[];
  isWon: boolean;
  isLost: boolean;
  clearedCategories: Category[];
  guessHistory: Word[][];
};
