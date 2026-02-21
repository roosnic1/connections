/**
 * E2E test seed script — invoked via `npx tsx e2e/seed.ts` from global-setup.
 * Creates three fixture connections in the test database:
 *   id 1 → PUBLISHED  (used by game tests)
 *   id 2 → REVIEW     (used by review tests)
 *   id 3 → DRAFT      (used by admin tests)
 */
import { Difficulty } from "@/prisma/generated/prisma/client";
import prisma from "@/lib/prisma";

const levelMap: Record<string, Difficulty> = {
  EASY: Difficulty.EASY,
  MEDIUM: Difficulty.MEDIUM,
  HARD: Difficulty.HARD,
  EXPERT: Difficulty.EXPERT,
};

type CategoryInput = {
  title: string;
  words: string[];
  level: keyof typeof levelMap;
};

// First two entries from prisma/connections.json
const publishedCategories: CategoryInput[] = [
  {
    title: "Fussballspieler",
    words: ["sommer", "keller", "hitz", "frei"],
    level: "EASY",
  },
  {
    title: "Musikerinnen",
    words: ["winter", "button", "känzig", "gfeller"],
    level: "MEDIUM",
  },
  {
    title: "Zürcher wege",
    words: ["laternen", "herbst", "panorama", "zelt"],
    level: "HARD",
  },
  {
    title: "Spät",
    words: ["frühling", "lese", "zünder", "i"],
    level: "EXPERT",
  },
];

const reviewCategories: CategoryInput[] = [
  {
    title: "____grund",
    words: ["ab", "letzi", "unter", "hinter"],
    level: "EASY",
  },
  {
    title: "Areale",
    words: ["hunziker", "hürlimann", "toni", "koch"],
    level: "MEDIUM",
  },
  {
    title: "Biere",
    words: ["löwenbräu", "chopfab", "sprint", "amboss"],
    level: "HARD",
  },
  {
    title: "Schmiedutensielien",
    words: ["hammer", "glut", "wasser", "fächer"],
    level: "EXPERT",
  },
];

const draftCategories: CategoryInput[] = [
  {
    title: "Elemente von Stadtzürcherquartieren",
    words: ["Turm", "Anker", "Kleeblatt", "Hufeisen"],
    level: "EASY",
  },
  {
    title: "Insekten",
    words: ["Marienkäfer", "Bienen", "Flöhe", "Grasshoppers"],
    level: "MEDIUM",
  },
  {
    title: "Spionequipment",
    words: ["Mikrofon", "Wanze", "Feldstecher", "Drohne"],
    level: "HARD",
  },
  {
    title: "Fussballclubs",
    words: ["Young Boys", "Bianconeri", "Bebbi", "Eulachstädter"],
    level: "EXPERT",
  },
];

async function seed() {
  const now = new Date();

  // Delete existing fixtures so re-runs always reflect current seed data.
  // Categories cascade-delete with their connection.
  await prisma.connection.deleteMany({ where: { id: { in: [1, 2, 3] } } });

  await prisma.connection.create({
    data: {
      id: 1,
      state: "PUBLISHED",
      publishDate: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      ),
      publishedAt: now,
      categories: {
        create: publishedCategories.map((c) => ({
          title: c.title,
          words: c.words,
          level: levelMap[c.level],
        })),
      },
    },
  });

  await prisma.connection.create({
    data: {
      id: 2,
      state: "REVIEW",
      categories: {
        create: reviewCategories.map((c) => ({
          title: c.title,
          words: c.words,
          level: levelMap[c.level],
        })),
      },
    },
  });

  await prisma.connection.create({
    data: {
      id: 3,
      state: "DRAFT",
      categories: {
        create: draftCategories.map((c) => ({
          title: c.title,
          words: c.words,
          level: levelMap[c.level],
        })),
      },
    },
  });

  console.log("[e2e/seed] Fixture connections seeded (ids 1, 2, 3)");
}

seed().catch((e) => {
  console.error("[e2e/seed] Error:", e);
  process.exit(1);
});
