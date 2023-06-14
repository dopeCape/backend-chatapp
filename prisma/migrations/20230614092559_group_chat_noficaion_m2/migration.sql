-- DropForeignKey
ALTER TABLE "groupChatRef" DROP CONSTRAINT "groupChatRef_groupChatId_fkey";

-- AlterTable
ALTER TABLE "groupChatRef" ALTER COLUMN "groupChatId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "groupChatRef" ADD CONSTRAINT "groupChatRef_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "groupChat"("id") ON DELETE SET NULL ON UPDATE CASCADE;
