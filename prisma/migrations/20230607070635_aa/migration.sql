/*
  Warnings:

  - You are about to drop the column `adminId` on the `groupChat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "groupChat" DROP CONSTRAINT "groupChat_adminId_fkey";

-- AlterTable
ALTER TABLE "groupChat" DROP COLUMN "adminId";

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
