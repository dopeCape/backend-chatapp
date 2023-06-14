/*
  Warnings:

  - You are about to drop the `_chatWorkSpaceTogroupChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_chatWorkSpaceTogroupChat" DROP CONSTRAINT "_chatWorkSpaceTogroupChat_A_fkey";

-- DropForeignKey
ALTER TABLE "_chatWorkSpaceTogroupChat" DROP CONSTRAINT "_chatWorkSpaceTogroupChat_B_fkey";

-- DropTable
DROP TABLE "_chatWorkSpaceTogroupChat";

-- CreateTable
CREATE TABLE "groupChatRef" (
    "id" TEXT NOT NULL,
    "chatWorkSpaceId" TEXT NOT NULL,
    "groupChatId" TEXT NOT NULL,
    "unRead" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "groupChatRef_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groupChatRef_id_key" ON "groupChatRef"("id");

-- AddForeignKey
ALTER TABLE "groupChatRef" ADD CONSTRAINT "groupChatRef_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupChatRef" ADD CONSTRAINT "groupChatRef_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "groupChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
