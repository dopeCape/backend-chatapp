-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_chatWorkSpaceId_fkey";

-- DropForeignKey
ALTER TABLE "Friend" DROP CONSTRAINT "Friend_friendId_fkey";

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "chatWorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
