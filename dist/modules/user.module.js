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
exports.makeUserAFriend = exports.sendEmailInvite = exports.searchUser = exports.createInvite = exports.getInvite = exports.getUserData = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const db_config_1 = require("../config/db.config");
const uuid_1 = require("uuid");
const workspace_module_1 = require("./workspace.module");
function getInvite(email) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        try {
            let request = yield prisma.invites.findFirst({
                where: {
                    email: email,
                },
                include: {
                    workspace: true,
                },
            });
            return request;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getInvite = getInvite;
function createInvite(email, role, workspaceId) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        let invite = yield getInvite(email);
        let x = true;
        try {
            if (invite === null) {
                prisma.invites.create({
                    data: {
                        email: email,
                        role: role,
                        workspace: {
                            connect: workspaceId,
                        },
                    },
                    include: {
                        workspace: true,
                    },
                });
                return "invite send";
            }
            else {
                return "already invited ";
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createInvite = createInvite;
function deleteRequest() {
    return __awaiter(this, void 0, void 0, function* () { });
}
function createUser(user, workspaceId, groupChatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let prisma = (0, db_config_1.getDb)();
            let uid = (0, uuid_1.v4)();
            let created_user = yield prisma.user.create({
                data: {
                    name: user.name,
                    fireBaseid: user.fireBaseid,
                    email: user.email,
                    admin: user.admin,
                    profilePic: user.profilePic,
                    chatWorkSpaces: {
                        create: { role: user.role_ },
                    },
                },
                include: {
                    chatWorkSpaces: {
                        include: {
                            user: true,
                            workspaces: true,
                            Friend: {
                                include: {
                                    friend: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                    chat: {
                                        include: {
                                            msges: {
                                                include: {
                                                    replys: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            groupChats: {
                                include: {
                                    msges: {
                                        include: {
                                            replys: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            let msg = null;
            if (workspaceId != null) {
                let { msg_, workspace_, groupChatId } = yield (0, workspace_module_1.addUserToWorkSpace)(created_user.chatWorkSpaceId, created_user.name, created_user.email, "email");
                created_user = yield prisma.user.findFirst({
                    where: {
                        fireBaseid: user.fireBaseid,
                    },
                    include: {
                        chatWorkSpaces: {
                            include: {
                                user: true,
                                workspaces: true,
                                Friend: {
                                    include: {
                                        friend: {
                                            include: {
                                                user: true,
                                            },
                                        },
                                        chat: {
                                            include: {
                                                msges: {
                                                    include: {
                                                        replys: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                groupChats: {
                                    include: {
                                        msges: {
                                            include: {
                                                replys: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                });
                let user_ = yield prisma.chatWorkSpace.findFirst({
                    where: { id: created_user.chatWorkSpaceId },
                    include: { user: true },
                });
                return { created_user, workspace_, msg_, user_, groupChatId };
            }
            return { created_user };
            // _=await newMemeberInWorkspce()
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createUser = createUser;
function sendEmailInvite(email, workspaceId, role) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        try {
            let user = yield prisma.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (role == "member") {
                role = client_1.Role.MEMBER;
            }
            else {
                role = client_1.Role.EXTERNAL;
            }
            if (user == null) {
                let invite = yield prisma.invites.findFirst({
                    where: {
                        email: email,
                    },
                    include: {
                        workspace: true,
                    },
                });
                if (invite == null) {
                    let inveite_ = yield prisma.invites.create({
                        data: {
                            email: email,
                            workspace: {
                                connect: {
                                    id: workspaceId,
                                },
                            },
                            role: role,
                        },
                    });
                    return "invite send";
                }
                else {
                    let x = true;
                    invite.workspace.forEach((y) => {
                        if (y.id === workspaceId) {
                            x = false;
                        }
                    });
                    if (x) {
                        let invite_ = yield prisma.invites.update({
                            where: {
                                email: email,
                            },
                            data: {
                                workspace: {
                                    connect: {
                                        id: workspaceId,
                                    },
                                },
                            },
                        });
                        return "invite send";
                    }
                    else {
                        return "already invited to the workspace";
                    }
                }
            }
            else {
                return `user alreay exists:${user.name}`;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.sendEmailInvite = sendEmailInvite;
function searchUser(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        try {
            let users = yield prisma.user.findMany({
                where: {
                    name: {
                        contains: name,
                        mode: "insensitive", // Case-insensitive search
                    },
                },
                include: {
                    chatWorkSpaces: true,
                },
            });
            console.log(users);
            return users;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.searchUser = searchUser;
function getUserData(fireBaseid) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(fireBaseid);
        try {
            let prisma = (0, db_config_1.getDb)();
            let user_ = yield prisma.user.findUnique({
                where: {
                    fireBaseid: fireBaseid,
                },
                include: {
                    chatWorkSpaces: {
                        include: {
                            user: true,
                            workspaces: {
                                include: {
                                    chatWorkSpace: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                            Friend: {
                                include: {
                                    friend: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                    chat: {
                                        include: {
                                            msges: {
                                                include: {
                                                    from: true,
                                                    replys: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            groupChats: {
                                include: {
                                    msges: {
                                        include: {
                                            from: true,
                                            replys: true,
                                        },
                                    },
                                    user: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            return user_;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getUserData = getUserData;
function makeUserAFriend(user1, user2, workspace, content, type, url) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        if (url == undefined) {
            url = "";
        }
        try {
            console.log("wtf");
            let user1_ = yield prisma.chatWorkSpace.update({
                where: {
                    id: user1.id,
                },
                data: {
                    Friend: {
                        create: {
                            chat: {
                                create: {
                                    workspace: {
                                        connect: {
                                            id: workspace,
                                        },
                                    },
                                    msges: {
                                        create: [
                                            {
                                                type: "CMD",
                                                content: "Start of the converstion",
                                            },
                                            {
                                                content: content,
                                                type: type,
                                                url: url,
                                                from: {
                                                    connect: {
                                                        id: user1.user.id,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                            friend: {
                                connect: {
                                    id: user2.id,
                                },
                            },
                        },
                    },
                },
                include: {
                    user: true,
                    workspaces: true,
                    Friend: {
                        include: {
                            friend: {
                                include: {
                                    user: true,
                                },
                            },
                            chat: {
                                include: {
                                    msges: {
                                        include: {
                                            from: true,
                                            replys: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            let user2_ = yield prisma.chatWorkSpace.update({
                where: {
                    id: user2.id,
                },
                data: {
                    Friend: {
                        create: {
                            chat: { connect: { id: user1_.Friend.at(-1).chatId } },
                            friend: { connect: { id: user1_.id } },
                        },
                    },
                },
                include: {
                    Friend: {
                        include: {
                            friend: {
                                include: {
                                    user: true,
                                },
                            },
                            chat: {
                                include: {
                                    workspace: true,
                                    msges: {
                                        include: {
                                            from: true,
                                            replys: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            let toSendUser1 = user1_.Friend.at(-1);
            let toSendUser2 = user2_.Friend.at(-1);
            return { toSendUser1, toSendUser2 };
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.makeUserAFriend = makeUserAFriend;
