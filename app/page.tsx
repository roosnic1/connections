import prisma from "@/lib/prisma";
import { UnleashClient } from "unleash-proxy-client";
import { Category } from "./_types";
import Game from "./game";
import { Bounce, ToastContainer } from "react-toastify";

export default async function Home() {
  const connections = await prisma.connection.findMany({
    //relationLoadStrategy: 'join', // or 'query'
    include: {
      categories: true,
    },
  });

  const categories: Category[] = connections[
    Math.floor(Math.random() * connections.length)
  ]?.categories.map((category) => ({
    category: category.title,
    items: category.words,
    level: category.level as 1 | 2 | 3 | 4,
  }));
  //console.log(categories)

  const unleash = new UnleashClient({
    url: process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_URL || "",
    clientKey: process.env.NEXT_PUBLIC_UNLEASH_FRONTEND_API_TOKEN || "",
    appName: "connections",
  });

  await unleash.start();

  const isEnabled = unleash.isEnabled("ask_feedback");
  console.log(`ASK_FEEDBACK: ${isEnabled ? "enabled" : "disabled"}`);

  return (
    <>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
        <Game categories={categories || []} />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        closeButton={false}
        theme="light"
        transition={Bounce}
      />
    </>
  );
}
