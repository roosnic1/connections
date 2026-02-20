import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { connectionId, reviewerName, difficulty, comment, isWon } = body;

  if (
    !connectionId ||
    !reviewerName ||
    typeof difficulty !== "number" ||
    typeof isWon !== "boolean"
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const review = await prisma.review.create({
    data: {
      connectionId,
      reviewerName,
      difficulty,
      comment: comment ?? null,
      isWon,
    },
  });

  return NextResponse.json({ id: review.id });
}
