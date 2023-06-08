-- CreateEnum
CREATE TYPE "type" AS ENUM ('MSG', 'LINK', 'FILE', 'REPLY', 'IMG', 'VIDEO', 'CMD');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EXTERNAL', 'MEMBER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePic" TEXT NOT NULL,
    "fireBaseid" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "chatWorkSpaceId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "workspaceId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "groupChat" (
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "groupChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "msges" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "type" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "chatId" TEXT,
    "groupChatId" TEXT,
    "msgesId" TEXT,

    CONSTRAINT "msges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "groupChatId" TEXT[],

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friend" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "chatWorkSpaceId" TEXT,
    "friendId" TEXT,

    CONSTRAINT "Friend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chatWorkSpace" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL,

    CONSTRAINT "chatWorkSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invites" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WorkspaceTochatWorkSpace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_chatWorkSpaceTogroupChat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InvitesToWorkspace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

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
CREATE UNIQUE INDEX "groupChat_id_key" ON "groupChat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "groupChat_workspaceId_key" ON "groupChat"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "msges_id_key" ON "msges"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_id_key" ON "Workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_name_key" ON "Workspace"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_groupChatId_key" ON "Workspace"("groupChatId");

-- CreateIndex
CREATE UNIQUE INDEX "Friend_id_key" ON "Friend"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chatWorkSpace_id_key" ON "chatWorkSpace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Invites_id_key" ON "Invites"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Invites_email_key" ON "Invites"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_WorkspaceTochatWorkSpace_AB_unique" ON "_WorkspaceTochatWorkSpace"("A", "B");

-- CreateIndex
CREATE INDEX "_WorkspaceTochatWorkSpace_B_index" ON "_WorkspaceTochatWorkSpace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_chatWorkSpaceTogroupChat_AB_unique" ON "_chatWorkSpaceTogroupChat"("A", "B");

-- CreateIndex
CREATE INDEX "_chatWorkSpaceTogroupChat_B_index" ON "_chatWorkSpaceTogroupChat"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InvitesToWorkspace_AB_unique" ON "_InvitesToWorkspace"("A", "B");

-- CreateIndex
CREATE INDEX "_InvitesToWorkspace_B_index" ON "_InvitesToWorkspace"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupChat" ADD CONSTRAINT "groupChat_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msges" ADD CONSTRAINT "msges_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msges" ADD CONSTRAINT "msges_groupChatId_fkey" FOREIGN KEY ("groupChatId") REFERENCES "groupChat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msges" ADD CONSTRAINT "msges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "msges" ADD CONSTRAINT "msges_msgesId_fkey" FOREIGN KEY ("msgesId") REFERENCES "msges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_chatWorkSpaceId_fkey" FOREIGN KEY ("chatWorkSpaceId") REFERENCES "chatWorkSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friend" ADD CONSTRAINT "Friend_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "chatWorkSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceTochatWorkSpace" ADD CONSTRAINT "_WorkspaceTochatWorkSpace_A_fkey" FOREIGN KEY ("A") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WorkspaceTochatWorkSpace" ADD CONSTRAINT "_WorkspaceTochatWorkSpace_B_fkey" FOREIGN KEY ("B") REFERENCES "chatWorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatWorkSpaceTogroupChat" ADD CONSTRAINT "_chatWorkSpaceTogroupChat_A_fkey" FOREIGN KEY ("A") REFERENCES "chatWorkSpace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_chatWorkSpaceTogroupChat" ADD CONSTRAINT "_chatWorkSpaceTogroupChat_B_fkey" FOREIGN KEY ("B") REFERENCES "groupChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitesToWorkspace" ADD CONSTRAINT "_InvitesToWorkspace_A_fkey" FOREIGN KEY ("A") REFERENCES "Invites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InvitesToWorkspace" ADD CONSTRAINT "_InvitesToWorkspace_B_fkey" FOREIGN KEY ("B") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
