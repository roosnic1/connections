import { Difficulty, Word } from "@/app/[locale]/_types";

const VALID_DIFFICULTIES = new Set<string>(Object.values(Difficulty));

function isWord(v: unknown): v is Word {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.word === "string" && VALID_DIFFICULTIES.has(obj.level as string)
  );
}

export function parseGuessHistory(raw: unknown): Word[][] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(Array.isArray)
    .map((row) => (row as unknown[]).filter(isWord))
    .filter((arr) => arr.length > 0);
}
