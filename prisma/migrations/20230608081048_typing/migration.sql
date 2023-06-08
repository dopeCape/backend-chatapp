/*
  Warnings:

  - Made the column `typing` on table `Chat` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "typing" SET NOT NULL,
ALTER COLUMN "typing" SET DEFAULT false;
