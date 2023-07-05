-- CreateEnum
CREATE TYPE "GroupChatvisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "GroupupType" AS ENUM ('GROUP', 'CHANNEL');

-- AlterEnum
ALTER TYPE "type" ADD VALUE 'FORWARD';

-- AlterTable
ALTER TABLE "groupChat" ADD COLUMN     "type" "GroupupType",
ADD COLUMN     "visibility" "GroupChatvisibility";
