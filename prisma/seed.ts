import { PrismaClient, Difficulty } from "@/prisma/generated/prisma/client";
import { DateTime } from "luxon";
const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL!,
});

async function main() {
  const now = DateTime.now().setZone("Europe/Berlin");
  const data = [
    {
      publishDate: now.set({ hour: 0, minute: 0, second: 1, millisecond: 0 }),
      categories: [
        {
          title: "letzi____",
          words: ["park", "grund", "graben", "strasse"],
          level: Difficulty.EASY,
        },
        {
          title: "____quai",
          words: ["limmat", "sihl", "bahnhof", "uto"],
          level: Difficulty.MEDIUM,
        },
        {
          title: "Schweizer Schauspielerinnen",
          words: ["wedler", "braunschweig", "schuler", "winiger"],
          level: Difficulty.HARD,
        },
        {
          title: "Thomas",
          words: ["mann", "bucheli", "müller", "borer"],
          level: Difficulty.EXPERT,
        },
      ],
    },
    {
      publishDate: now
        .set({ hour: 0, minute: 0, second: 1, millisecond: 0 })
        .plus({ days: 1 }),
      categories: [
        {
          title: "Supermarkt",
          words: ["frisch", "gefroren", "konserviert", "eingemacht"],
          level: Difficulty.EASY,
        },
        {
          title: "Homo _____",
          words: ["faber", "deus", "sapiens", "sexuell"],
          level: Difficulty.MEDIUM,
        },
        {
          title: "Zürcher Rapper:innen",
          words: ["skor", "big zis", "luuk", "eaz"],
          level: Difficulty.HARD,
        },
        {
          title: "Orte an der Amerikanischen Ostküste:",
          words: ["montauk", "beaufort", "brunswick", "st. augustine"],
          level: Difficulty.EXPERT,
        },
      ],
    },
    {
      publishDate: now
        .set({ hour: 0, minute: 0, second: 1, millisecond: 0 })
        .plus({ days: 2 }),
      categories: [
        {
          title: "Fussballspieler",
          words: ["sommer", "keller", "hitz", "frei"],
          level: Difficulty.EASY,
        },
        {
          title: "Musikerinnen",
          words: ["winter", "button", "känzig", "gfeller"],
          level: Difficulty.MEDIUM,
        },
        {
          title: "Zürcher Wege",
          words: ["laternen", "herbst", "panorama", "zelt"],
          level: Difficulty.HARD,
        },
        {
          title: "Spät____",
          words: ["frühling", "lese", "zünder", "i"],
          level: Difficulty.EXPERT,
        },
      ],
    },
    {
      publishDate: now
        .set({ hour: 0, minute: 0, second: 1, millisecond: 0 })
        .plus({ days: 3 }),
      categories: [
        {
          title: "____grund",
          words: ["ab", "letzi", "unter", "hinter"],
          level: Difficulty.EASY,
        },
        {
          title: "Zürcher Areale",
          words: ["hunziker", "hürlimann", "toni", "koch"],
          level: Difficulty.MEDIUM,
        },
        {
          title: "Zürcher Bier",
          words: ["löwenbräu", "chopfab", "sprint", "amboss"],
          level: Difficulty.HARD,
        },
        {
          title: "Schmied-Werkzeuge",
          words: ["hammer", "glut", "wasser", "zange"],
          level: Difficulty.EXPERT,
        },
      ],
    },
  ];
  const connections = [];
  for (const item of data) {
    connections.push(
      await prisma.connection.create({
        data: {
          publishDate: item.publishDate.toJSDate(),
          categories: {
            create: item.categories,
          },
        },
      }),
    );
  }

  console.log(connections);
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
