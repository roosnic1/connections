import prisma from "@/lib/prisma";
import { ConnectionGame } from "../_types";
import { notFound, redirect } from "next/navigation";
import GameTesting from "@/app/[locale]/_components/game-testing";
import { getPostHogServer } from "@/lib/posthog-server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const posthog = getPostHogServer();
  const gameTestingAllowed = await posthog.isFeatureEnabled(
    "game-testing-allowed",
    "asd",
  );
  if (!gameTestingAllowed) {
    console.warn("Game testing is disabled. Redirecting to home page.");
    redirect("/");
  }

  const connections = await prisma.connection.findMany({
    take: 100,
    orderBy: [{ createdAt: "desc" }],
    //relationLoadStrategy: 'join', // or 'query'
    include: {
      categories: true,
    },
  });

  if (connections.length === 0) notFound();

  const connectionGames: ConnectionGame[] = connections.map((connection) => {
    return {
      id: connection.id,
      publishDate: connection.publishDate,
      categories: connection.categories.map((category) => ({
        category: category.title,
        items: category.words,
        level: category.level as 1 | 2 | 3 | 4,
      })),
    };
  });

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <GameTesting games={connectionGames} />
    </div>
  );
}
