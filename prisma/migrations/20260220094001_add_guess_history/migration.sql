-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "guessHistory" JSONB NOT NULL DEFAULT '[]';
