import { PrismaClient } from "@/app/generated/prisma/client";
import { DateTime } from "luxon";
const prisma = new PrismaClient();

async function main() {
  const now = DateTime.now().setZone("Europe/Berlin");
  const data = [
    {
      publishDate: now.set({ hour: 0, minute: 0, second: 1, millisecond: 0 }),
      categories: [
        {
          title: "Fussballspieler",
          words: ["sommer", "keller", "hitz", "frei"],
          level: 1,
        },
        {
          title: "Musikerinnen",
          words: ["winter", "button", "känzig", "gfeller"],
          level: 2,
        },
        {
          title: "Zürcher Wege",
          words: ["laternen", "herbst", "panorama", "zelt"],
          level: 3,
        },
        {
          title: "Spät____",
          words: ["frühling", "lese", "zünder", "i"],
          level: 4,
        },
      ],
    },
    {
      publishDate: now.set({ hour: 0, minute: 0, second: 1, millisecond: 0 }),
      categories: [
        {
          title: "____grund",
          words: ["ab", "letzi", "unter", "hinter"],
          level: 1,
        },
        {
          title: "Zürcher Areale",
          words: ["hunziker", "hürlimann", "toni", "koch"],
          level: 2,
        },
        {
          title: "Zürcher Bier",
          words: ["löwenbräu", "chopfab", "sprint", "amboss"],
          level: 3,
        },
        {
          title: "Schmied-Werkzeuge",
          words: ["hammer", "glut", "wasser", "zange"],
          level: 4,
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
