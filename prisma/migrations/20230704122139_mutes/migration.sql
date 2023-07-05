-- AlterTable
ALTER TABLE "Friend" ADD COLUMN     "muted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "groupChatRef" ADD COLUMN     "muted" BOOLEAN NOT NULL DEFAULT false;
