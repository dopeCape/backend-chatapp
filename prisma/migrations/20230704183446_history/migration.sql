-- AlterTable
ALTER TABLE "HistoryEntryes" ADD COLUMN     "historyId" TEXT;

-- AddForeignKey
ALTER TABLE "HistoryEntryes" ADD CONSTRAINT "HistoryEntryes_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "History"("id") ON DELETE SET NULL ON UPDATE CASCADE;
