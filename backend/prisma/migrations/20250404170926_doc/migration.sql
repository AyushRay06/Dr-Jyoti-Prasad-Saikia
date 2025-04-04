-- AlterTable
ALTER TABLE "content" ADD COLUMN     "docLink" TEXT,
ALTER COLUMN "body" DROP NOT NULL;
