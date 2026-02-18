-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- Convert Int level to Difficulty enum
-- 1. Drop existing constraints that reference the level column
DROP INDEX "Category_connectionId_level_key";

-- 2. Add a temporary column with the new enum type
ALTER TABLE "Category" ADD COLUMN "level_new" "Difficulty";

-- 3. Map existing integer values to enum values
UPDATE "Category" SET "level_new" = CASE "level"
  WHEN 1 THEN 'EASY'::"Difficulty"
  WHEN 2 THEN 'MEDIUM'::"Difficulty"
  WHEN 3 THEN 'HARD'::"Difficulty"
  WHEN 4 THEN 'EXPERT'::"Difficulty"
END;

-- 4. Drop old column, rename new one, set NOT NULL
ALTER TABLE "Category" DROP COLUMN "level";
ALTER TABLE "Category" RENAME COLUMN "level_new" TO "level";
ALTER TABLE "Category" ALTER COLUMN "level" SET NOT NULL;

-- 5. Re-create the compound unique constraint with the new enum column
CREATE UNIQUE INDEX "Category_connectionId_level_key" ON "Category"("connectionId", "level");