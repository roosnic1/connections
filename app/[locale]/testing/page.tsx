import prisma from "@/lib/prisma";
import { UnleashClient } from "unleash-proxy-client";
import { ConnectionGame } from "../_types";
import { redirect } from "next/navigation";
import GameTesting from "@/app/[locale]/_components/game-testing";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const unleash = new UnleashClient({
    url: process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL || "",
    clientKey: process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN || "",
    appName: "connections",
  });

  await unleash.start();

  const isTestingEnabled = unleash.isEnabled("game_testing");
  if (!isTestingEnabled) {
    console.warn("Game testing is disabled. Redirecting to home page.");
    redirect("/");
  }

  console.log("testing enabled.");

  const connections = await prisma.connection.findMany({
    take: 100,
    orderBy: [{ createdAt: "desc" }],
    //relationLoadStrategy: 'join', // or 'query'
    include: {
      categories: true,
    },
  });

  // TODO: what to do when no connection is found.
  if (connections.length === 0) return;

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
