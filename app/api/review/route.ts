import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const VALID_DIFFICULTIES = [1, 2, 3, 4, 5];
const VALID_LEVELS = ["EASY", "MEDIUM", "HARD", "EXPERT"];
const MAX_NAME_LENGTH = 50;
const MAX_COMMENT_LENGTH = 1000;
const MAX_GUESSES = 8;

export async function POST(req: Request) {
  const body = await req.json();
  const {
    connectionId,
    reviewerName,
    difficulty,
    comment,
    isWon,
    guessHistory,
  } = body;

  if (
    !connectionId ||
    !reviewerName ||
    typeof difficulty !== "number" ||
    typeof isWon !== "boolean" ||
    !Array.isArray(guessHistory)
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }

  const trimmedName =
    typeof reviewerName === "string" ? reviewerName.trim() : "";
  if (trimmedName.length === 0 || trimmedName.length > MAX_NAME_LENGTH) {
    return NextResponse.json(
      { error: "Invalid reviewer name" },
      { status: 400 },
    );
  }

  if (comment !== null && comment !== undefined) {
    if (typeof comment !== "string" || comment.length > MAX_COMMENT_LENGTH) {
      return NextResponse.json({ error: "Comment too long" }, { status: 400 });
    }
  }

  if (guessHistory.length > MAX_GUESSES) {
    return NextResponse.json(
      { error: "Invalid guess history" },
      { status: 400 },
    );
  }
  for (const guess of guessHistory) {
    if (!Array.isArray(guess) || guess.length !== 4) {
      return NextResponse.json(
        { error: "Invalid guess history" },
        { status: 400 },
      );
    }
    for (const word of guess) {
      if (
        typeof word?.word !== "string" ||
        !VALID_LEVELS.includes(word?.level)
      ) {
        return NextResponse.json(
          { error: "Invalid guess history" },
          { status: 400 },
        );
      }
    }
  }

  const connection = await prisma.connection.findUnique({
    where: { id: connectionId },
    select: { state: true },
  });

  if (!connection) {
    return NextResponse.json(
      { error: "Connection not found" },
      { status: 404 },
    );
  }

  if (connection.state !== "REVIEW") {
    return NextResponse.json(
      { error: "Connection is not in review state" },
      { status: 403 },
    );
  }

  const review = await prisma.review.create({
    data: {
      connectionId,
      reviewerName: trimmedName,
      difficulty,
      comment: comment?.trim() ?? null,
      isWon,
      guessHistory,
    },
  });

  return NextResponse.json({ id: review.id });
}
