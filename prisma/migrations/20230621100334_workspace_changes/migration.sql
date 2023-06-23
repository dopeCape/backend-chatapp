/*
  Warnings:

  - The values [LINK] on the enum `type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "type_new" AS ENUM ('MSG', 'LINKMSG', 'FILE', 'REPLY', 'IMG', 'VIDEO', 'CMD', 'STICKER');
ALTER TABLE "msges" ALTER COLUMN "type" TYPE "type_new" USING ("type"::text::"type_new");
ALTER TYPE "type" RENAME TO "type_old";
ALTER TYPE "type_new" RENAME TO "type";
DROP TYPE "type_old";
COMMIT;

-- DropIndex
DROP INDEX "Workspace_groupChatId_key";

-- AlterTable
ALTER TABLE "Workspace" ADD COLUMN     "description" TEXT,
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "topic" TEXT;
