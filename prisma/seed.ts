import { PrismaClient } from "@/app/generated/prisma/client";
const prisma = new PrismaClient();

async function main() {
  const data = [
    {
      publishDate: null,
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
      publishDate: null,
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
          publishDate: item.publishDate,
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
