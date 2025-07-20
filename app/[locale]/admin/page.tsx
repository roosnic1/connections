import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import CollapsibleTable from "@/app/_components/collapsibleTable";
import prisma from "@/lib/prisma";
import { ConnectionGame } from "@/app/_types";

export default async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/admin")}`);
  }

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
        id: category.id,
        category: category.title,
        items: category.words,
        level: category.level as 1 | 2 | 3 | 4,
      })),
    };
  });

  return (
    <div className="flex flex-col items-center mx-auto mt-14">
      <h1 className="text-black">Welcome, {session.user?.name}</h1>
      <Link className="text-black" href="/api/auth/signout">
        Sign out
      </Link>

      <CollapsibleTable connections={connectionGames} />
    </div>
  );
};
