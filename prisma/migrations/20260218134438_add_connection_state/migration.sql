-- CreateEnum
CREATE TYPE "ConnectionState" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED');

-- DropIndex
DROP INDEX "Connection_publishDate_key";

-- AlterTable
ALTER TABLE "Connection" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "state" "ConnectionState" NOT NULL DEFAULT 'DRAFT',
ALTER COLUMN "publishDate" DROP NOT NULL;

-- CreateIndex (partial): publishDate must be unique only among published connections
CREATE UNIQUE INDEX "Connection_publishDate_published_key"
ON "Connection" ("publishDate")
WHERE state = 'PUBLISHED' AND "publishDate" IS NOT NULL;
