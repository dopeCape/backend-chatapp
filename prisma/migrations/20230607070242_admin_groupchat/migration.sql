/*
  Warnings:

  - Added the required column `adminId` to the `groupChat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "groupChat" DROP CONSTRAINT "groupChat_userId_fkey";

-- DropIndex
DROP INDEX "groupChat_userId_key";

-- AlterTable
ALTER TABLE "groupChat" ADD COLUMN     "adminId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
