import prisma from "@/lib/prisma";
import { auth } from "@/auth";

type RequestBodyProps = {
  id: number;
  data: {
    publishDate: Date;
    categories: {
      id: number;
      category: string;
      items: string[];
      level: 1 | 2 | 3 | 4;
    }[];
  };
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id, data } = (await request.json()) as RequestBodyProps;

  if (!data || !id) return new Response("Bad Request", { status: 400 });

  if (id < 0) {
    try {
      await prisma.connection.create({
        include: {
          categories: true,
        },
        data: {
          publishDate: data.publishDate,
          categories: {
            create: data.categories.map((category) => {
              return {
                title: category.category,
                words: category.items,
                level: category.level,
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
          publishDate: data.publishDate,
          categories: {
            updateMany: data.categories.map((category) => {
              return {
                where: {
                  id: category.id,
                },
                data: {
                  title: category.category,
                  words: category.items,
                  level: category.level,
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

  return Response.json({ success: true });
}
