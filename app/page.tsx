import Game from "./game";

import prisma from "@/lib/prisma";


export default async function Home() {
    const connections = await prisma.connection.findMany();
    console.log(connections);

  return (
    <>
        <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
            <h1 className="text-black text-4xl font-semibold my-4 ml-4">Hello</h1>
            <Game />
        </div>
    </>
  );
}
