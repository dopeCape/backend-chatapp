/*
  Warnings:

  - Changed the type of `type` on the `HistoryEntryes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "HistoryEntryes" DROP COLUMN "type",
ADD COLUMN     "type" "GroupupType" NOT NULL;

-- DropEnum
DROP TYPE "Entry";
