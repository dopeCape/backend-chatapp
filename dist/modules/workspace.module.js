"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToWorkSpace = exports.deleteAll = exports.createWrokspace = void 0;
const client_1 = require("@prisma/client");
const db_config_1 = require("../config/db.config");
function addUserToWorkSpace(chatWorkspaceId, name, email, source, workSpaceId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let prisma = (0, db_config_1.getDb)();
            if (source == "email") {
                let invite_ = yield prisma.invites.delete({
                    where: { email: email },
                    include: {
                        workspace: {
                            include: {
                                chatWorkSpace: {
                                    include: {
                                        groupChats: {
                                            where: {
                                                name: {
                                                    search: "general",
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                let workspace_ = yield prisma.workspace.update({
                    where: {
                        id: invite_.workspace[0].id,
                    },
                    data: {
                        chatWorkSpace: {
                            connect: {
                                id: chatWorkspaceId,
                            },
                        },
                    },
                    include: {
                        chatWorkSpace: {
                            include: { user: true },
                        },
                        groupChat: true,
                    },
                });
                let msg_ = yield prisma.msges.create({
                    data: {
                        content: `${name} joined ${workspace_.name}`,
                        type: client_1.type.CMD,
                    },
                });
                let groupChat = workspace_.groupChat.find((x) => {
                    return x.name == "general";
                });
                let groupChatId = groupChat.id;
                let groupChat_ = yield prisma.groupChat.update({
                    where: {
                        id: groupChatId,
                    },
                    data: {
                        msges: {
                            connect: { id: msg_.id },
                        },
                    },
                });
                yield prisma.chatWorkSpace.update({
                    where: {
                        id: chatWorkspaceId,
                    },
                    data: {
                        groupChats: {
                            connect: {
                                id: groupChat_.id,
                            },
                        },
                    },
                });
                return { msg_, workspace_, groupChatId };
            }
            else {
                let workspace_ = yield prisma.workspace.update({
                    where: {
                        id: workSpaceId,
                    },
                    data: {
                        chatWorkSpace: {
                            connect: {
                                id: chatWorkspaceId,
                            },
                        },
                    },
                    include: {
                        chatWorkSpace: {
                            include: { user: true },
                        },
                        groupChat: true,
                    },
                });
                let msg_ = yield prisma.msges.create({
                    data: {
                        content: `${name} joined ${workspace_.name}`,
                        type: client_1.type.CMD,
                    },
                });
                let groupChat = workspace_.groupChat.find((x) => {
                    return x.name == "general";
                });
                let groupChatId = groupChat.id;
                let groupChat_ = yield prisma.groupChat.update({
                    where: {
                        id: groupChatId,
                    },
                    data: {
                        msges: {
                            connect: { id: msg_.id },
                        },
                        user: {
                            connect: {
                                id: chatWorkspaceId,
                            },
                        },
                    },
                    include: {
                        msges: {
                            include: {
                                replys: true,
                            },
                        },
                        user: {
                            include: {
                                user: true,
                            },
                        },
                    },
                });
                let user_ = yield prisma.chatWorkSpace.update({
                    where: {
                        id: chatWorkspaceId,
                    },
                    data: {
                        groupChats: {
                            connect: {
                                id: groupChat_.id,
                            },
                        },
                    },
                    include: {
                        user: true,
                    },
                });
                return { workspace_, groupChat_, msg_, groupChatId, user_ };
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addUserToWorkSpace = addUserToWorkSpace;
function createWrokspace(workspace, chatWorkspaceId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        try {
            let user = yield prisma.chatWorkSpace.findFirst({
                where: { id: chatWorkspaceId },
                include: { user: true },
            });
            let workspace_ = yield prisma.workspace.create({
                data: {
                    name: workspace.name,
                    chatWorkSpace: {
                        connect: {
                            id: chatWorkspaceId,
                        },
                    },
                },
                include: {
                    chatWorkSpace: true,
                },
            });
            let groupChat = yield prisma.groupChat.create({
                data: {
                    name: "general",
                    workspace: { connect: { id: workspace_.id } },
                    admin: {
                        connect: {
                            id: userId,
                        },
                    },
                    msges: {
                        create: {
                            content: `${user.user.name} created ${workspace.name}`,
                            type: client_1.type.CMD,
                        },
                    },
                    user: {
                        connect: {
                            id: chatWorkspaceId,
                        },
                    },
                },
                include: {
                    msges: true,
                    user: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
            let chatWorkSpace_ = yield prisma.chatWorkSpace.update({
                where: { id: chatWorkspaceId },
                data: { workspaces: { connect: { id: workspace_.id } } },
                include: {
                    workspaces: true,
                },
            });
            // return chatWorkSpace_;
            return { workspace_, groupChat, chatWorkSpace_ };
        }
        catch (error) {
            console.log(userId, "userid");
        }
    });
}
exports.createWrokspace = createWrokspace;
function deleteAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        try {
            // Delete all rows in the Friend table
            yield prisma.chat.deleteMany({});
            // Delete all rows in the Friend table
            yield prisma.friend.deleteMany({});
            // Delete all rows in the msges table
            yield prisma.msges.deleteMany({});
            // Delete all rows in the groupChat table
            yield prisma.groupChat.deleteMany({});
            // Delete all rows in the chatWorkSpace table
            yield prisma.chatWorkSpace.deleteMany({});
            // Delete all rows in the User table
            yield prisma.user.deleteMany({});
            // Delete all rows in the Invites table
            yield prisma.invites.deleteMany({});
            // Delete all rows in the Workspace table
            yield prisma.workspace.deleteMany({});
            res.send("dono");
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteAll = deleteAll;
