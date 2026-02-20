import prisma from "@/lib/prisma";
import { Category, ConnectionGame, Difficulty } from "../_types";
import ReviewPageClient from "./_components/review-page-client";

export default async function ReviewPage() {
  const connections = await prisma.connection.findMany({
    where: { state: "REVIEW" },
    include: { categories: true },
    orderBy: { createdAt: "asc" },
  });

  const connectionGames: ConnectionGame[] = connections.map((conn) => ({
    id: conn.id,
    publishDate: conn.publishDate,
    categories: conn.categories.map((cat) => ({
      category: cat.title,
      items: cat.words,
      level: cat.level as Difficulty,
    })),
  }));

  return <ReviewPageClient connections={connectionGames} />;
}
