/*
  Warnings:

  - A unique constraint covering the columns `[connectionId,level]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publishDate]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_connectionId_fkey";

-- CreateIndex
CREATE INDEX "Category_connectionId_idx" ON "Category"("connectionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_connectionId_level_key" ON "Category"("connectionId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_publishDate_key" ON "Connection"("publishDate");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
