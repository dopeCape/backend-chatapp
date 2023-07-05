-- CreateEnum
CREATE TYPE "Entry" AS ENUM ('CHANNEL', 'GROUP');

-- CreateTable
CREATE TABLE "HistoryEntryes" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "Entry" NOT NULL
);

-- CreateTable
CREATE TABLE "History" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "chatWorkSpaceId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "HistoryEntryes_id_key" ON "HistoryEntryes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "History_id_key" ON "History"("id");

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
