-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL,
    "fireBaseid" TEXT NOT NULL,
    "chatWorkSpaceId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatWorkSpaceId" TEXT,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "groupChat" (
    "id" TEXT NOT NULL,
    "msg" TEXT NOT NULL,
    "chatWorkSpaceId" TEXT,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "chatWorkSpaceId" TEXT,
    "groupChatId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "chatWorkSpace" (
    "id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Org_ownerId_key" ON "Org"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_fireBaseid_key" ON "User"("fireBaseid");

-- CreateIndex
CREATE UNIQUE INDEX "User_chatWorkSpaceId_key" ON "User"("chatWorkSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_workspaceId_key" ON "Chat"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_userId_key" ON "Chat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "groupChat_id_key" ON "groupChat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "groupChat_workspaceId_key" ON "groupChat"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "groupChat_userId_key" ON "groupChat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_id_key" ON "Workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_groupChatId_key" ON "Workspace"("groupChatId");

-- CreateIndex
CREATE UNIQUE INDEX "chatWorkSpace_id_key" ON "chatWorkSpace"("id");

-- AddForeignKey
ALTER TABLE "Org" ADD CONSTRAINT "Org_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workspace" ADD CONSTRAINT "Workspace_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
