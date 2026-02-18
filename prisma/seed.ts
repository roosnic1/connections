import { PrismaClient, Difficulty } from "@/prisma/generated/prisma/client";
import { DateTime } from "luxon";
import connections from "./connections.json";

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
});

const levelMap: Record<string, Difficulty> = {
  EASY: Difficulty.EASY,
  MEDIUM: Difficulty.MEDIUM,
  HARD: Difficulty.HARD,
  EXPERT: Difficulty.EXPERT,
};

async function main() {
  const today = DateTime.utc().startOf("day");
  const created = [];

  for (const [index, connection] of connections.entries()) {
    const publishDate = today.plus({ days: index }).toJSDate();
    created.push(
      await prisma.connection.create({
        data: {
          publishDate,
          categories: {
            create: connection.categories.map((cat) => ({
              title: cat.title,
              words: cat.words,
              level: levelMap[cat.level],
            })),
          },
        },
      }),
    );
  }

  console.log(`Created ${created.length} connections`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
