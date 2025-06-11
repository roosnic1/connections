/*
  Warnings:

  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Connection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

UPDATE "Category"
SET "updatedAt" = NOW() AT TIME ZONE 'Europe/Berlin'
WHERE "updatedAt" IS NULL;

ALTER TABLE "Category" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

UPDATE "Connection"
SET "updatedAt" = NOW() AT TIME ZONE 'Europe/Berlin'
WHERE "updatedAt" IS NULL;

ALTER TABLE "Connection" ALTER COLUMN "updatedAt" SET NOT NULL;