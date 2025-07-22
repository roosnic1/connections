import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import CollapsibleTable from "@/app/[locale]/_components/collapsibleTable";
import prisma from "@/lib/prisma";
import {
  ConnectionGame,
  createOrUpdateConnectionActionParams,
} from "@/app/[locale]/_types";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const session = await auth();

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

  const deleteConnection = async (id: number) => {
    "use server";
    try {
      const categories = prisma.category.deleteMany({
        where: {
          connectionId: id,
        },
      });

      const connection = prisma.connection.delete({
        where: { id },
      });

      await prisma.$transaction([categories, connection]);
    } catch (error) {
      // TODO: Handle error
      console.error(error);
      return new Response("Internal Server Error at create", { status: 500 });
    }

    revalidatePath("/admin");
  };

  const createOrUpdateConnection = async (
    props: createOrUpdateConnectionActionParams,
  ) => {
    "use server";
    const { id, publishingDate, categoriesState } = props;

    if (id < 0) {
      try {
        await prisma.connection.create({
          include: {
            categories: true,
          },
          data: {
            publishDate: publishingDate,
            categories: {
              create: categoriesState.map((category, i) => {
                return {
                  title: category[1],
                  words: category[2],
                  level: i,
                };
              }),
            },
          },
        });
      } catch (error) {
        // TODO: Handle error
        console.error(error);
        return new Response("Internal Server Error at create", { status: 500 });
      }
    } else {
      try {
        await prisma.connection.update({
          where: {
            id,
          },
          include: {
            categories: true,
          },
          data: {
            publishDate: publishingDate,
            categories: {
              updateMany: categoriesState.map((category, i) => {
                return {
                  where: {
                    id: category[0],
                  },
                  data: {
                    title: category[1],
                    words: category[2],
                    level: i,
                  },
                };
              }),
            },
          },
        });
      } catch (error) {
        // TODO: Handle error
        console.error(error);
        return new Response("Internal Server Error at update", { status: 500 });
      }
    }

    revalidatePath("/[locale]/admin");
  };

  return (
    <div className="flex flex-col items-center mx-auto mt-14">
      <h1 className="text-black">Welcome, {session.user?.name}</h1>
      <Link className="text-black" href="/api/auth/signout">
        Sign out
      </Link>

      <CollapsibleTable
        connections={connectionGames}
        createOrUpdateConnectionAction={createOrUpdateConnection}
        deleteConnectionAction={deleteConnection}
      />
    </div>
  );
}
