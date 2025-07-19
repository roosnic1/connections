import prisma from "@/lib/prisma";
import { UnleashClient } from "unleash-proxy-client";
import { Category, ConnectionGame } from "./_types";
import Game from "./_components/game";
import { DateTime } from "luxon";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const now = DateTime.now().setZone("Europe/Berlin");
  const connection = await prisma.connection.findFirst({
    where: {
      publishDate: {
        lte: now.plus({ days: 0 }).toJSDate(),
      },
    },
    orderBy: [{ createdAt: "desc" }],
    //relationLoadStrategy: 'join', // or 'query'
    include: {
      categories: true,
    },
  });

  // TODO: what to do when no connection is found.
  if (!connection) return;

  const categories: Category[] = connection.categories.map((category) => ({
    category: category.title,
    items: category.words,
    level: category.level as 1 | 2 | 3 | 4,
  }));

  const connectionGame: ConnectionGame = {
    id: connection.id,
    publishDate: connection.publishDate,
    categories,
  };

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <Game game={connectionGame} saveDataToLocalStorage={true} />
    </div>
  );
}
