/*
  Warnings:

  - Made the column `publishDate` on table `Connection` required. This step will fail if there are existing NULL values in that column.

*/
-- Update all NULL values in the publishDate column
UPDATE "Connection"
SET "publishDate" = NOW() AT TIME ZONE 'Europe/Berlin'
WHERE "publishDate" IS NULL;

-- AlterTable
ALTER TABLE "Connection" ALTER COLUMN "publishDate" SET NOT NULL;
