/*
  Warnings:

  - The values [REPLY] on the enum `type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "type_new" AS ENUM ('MSG', 'LINKMSG', 'FILE', 'IMG', 'VIDEO', 'CMD', 'STICKER', 'FORWARD');
ALTER TABLE "msges" ALTER COLUMN "type" TYPE "type_new" USING ("type"::text::"type_new");
ALTER TYPE "type" RENAME TO "type_old";
ALTER TYPE "type_new" RENAME TO "type";
DROP TYPE "type_old";
COMMIT;

-- AlterTable
ALTER TABLE "msges" ADD COLUMN     "isReply" BOOLEAN DEFAULT false;
