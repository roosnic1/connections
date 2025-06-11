import prisma from "@/lib/prisma";
import { UnleashClient } from "unleash-proxy-client";
import { Category } from "./_types";
import Game from "./game";
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

  /*const connections = await prisma.connection.findMany({
    where: {
      publishDate: {
        lte: DateTime.now().setZone("Europe/Berlin").toJSDate(),
      },
    },
    orderBy: [{createdAt: 'desc'}],
    //relationLoadStrategy: 'join', // or 'query'
    include: {
      categories: true,
    },
  });*/

  // TODO: what to do when no connection is found.
  // @ts-ignore
  const categories: Category[] = connection.categories.map((category) => ({
    category: category.title,
    items: category.words,
    level: category.level as 1 | 2 | 3 | 4,
  }));

  const unleash = new UnleashClient({
    url: process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL || "",
    clientKey: process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN || "",
    appName: "connections",
  });

  await unleash.start();

  const isEnabled = unleash.isEnabled("ask_feedback");
  console.log(`ASK_FEEDBACK: ${isEnabled ? "enabled" : "disabled"}`);
  const params = await searchParams;
  console.log("params", params);

  return (
    <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
      <Game categories={categories || []} />
    </div>
  );
}
