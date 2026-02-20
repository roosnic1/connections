-- DropIndex
DROP INDEX "Connection_publishDate_published_key";

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewerName" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "comment" TEXT,
    "isWon" BOOLEAN NOT NULL,
    "connectionId" INTEGER NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_connectionId_idx" ON "Review"("connectionId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_connectionId_fkey" FOREIGN KEY ("connectionId") REFERENCES "Connection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
