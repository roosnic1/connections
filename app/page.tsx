import prisma from "@/lib/prisma";
import { Category, Word } from "./_types";
import Game from "./game";

export default async function Home() {
  const connections = await prisma.connection.findMany({
    //relationLoadStrategy: 'join', // or 'query'
    include: {
      categories: true,
    },
  });
  const categories: Category[] = connections[
    Math.floor(Math.random() * connections.length)
  ].categories.map((category) => ({
    category: category.title,
    items: category.words,
    level: category.level as 1 | 2 | 3 | 4,
  }));
  //console.log(categories)

  return (
    <>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">Hello</h1>
        <Game categories={categories} />
      </div>
    </>
  );
}
