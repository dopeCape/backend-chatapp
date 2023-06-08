/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `groupChat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `groupChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "groupChat" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "groupChat_userId_key" ON "groupChat"("userId");

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
