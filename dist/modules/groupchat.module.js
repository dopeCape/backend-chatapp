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
exports.removeUser = exports.createNewGruop = exports.addMemebToGroup = void 0;
const db_config_1 = require("../config/db.config");
function addMemebToGroup(users, workspaceId, groupId, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const connectUsers = users.map((user) => ({
            id: user.id,
        }));
        let msg = `${name} added `;
        if (users.length > 1) {
            msg = msg + ` ${users[0].user.name}`;
        }
        else {
            users.forEach((x) => {
                msg = msg + ` ${x.user.name} `;
            });
        }
        try {
            let prisma = (0, db_config_1.getDb)();
            let group_ = yield prisma.groupChat.update({
                where: {
                    id: groupId,
                },
                data: {
                    user: {
                        connect: connectUsers,
                    },
                    msges: {
                        create: {
                            content: msg,
                            type: "CMD",
                        },
                    },
                },
                include: {
                    user: {
                        include: {
                            user: true,
                        },
                    },
                    msges: {
                        include: {
                            replys: true,
                            from: true,
                        },
                    },
                },
            });
            return group_;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addMemebToGroup = addMemebToGroup;
function createNewGruop(workspaceId, users, user, name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let prisma = (0, db_config_1.getDb)();
            let msg;
            if (users.length > 1) {
                msg = `${user.name} added :`;
            }
            else {
                msg = `${user.name} joined ${name} `;
            }
            const connectUsers = users.map((user) => ({
                id: user.id,
            }));
            users.forEach((x) => {
                if (x.user.id != user.id) {
                    msg = msg + ` ${x.user.name}`;
                }
            });
            let group_ = yield prisma.groupChat.create({
                data: {
                    name: name,
                    workspace: {
                        connect: {
                            id: workspaceId,
                        },
                    },
                    user: {
                        connect: connectUsers,
                    },
                    admin: {
                        connect: {
                            id: user.id,
                        },
                    },
                    msges: {
                        create: [
                            {
                                content: `${user.name} created ${name}`,
                                type: "CMD",
                            },
                            {
                                content: msg,
                                type: "CMD",
                            },
                        ],
                    },
                },
                include: {
                    user: {
                        include: {
                            user: true,
                        },
                    },
                    msges: {
                        include: {
                            replys: true,
                            from: true,
                        },
                    },
                },
            });
            return group_;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createNewGruop = createNewGruop;
function removeUser(msg, userId, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let prisma = (0, db_config_1.getDb)();
            let gruop_ = yield prisma.groupChat.update({
                where: {
                    id: chatId,
                },
                data: {
                    msges: {
                        create: {
                            type: "CMD",
                            content: msg,
                        },
                    },
                    user: {
                        disconnect: {
                            id: userId,
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
            let x = gruop_.msges.at(-1);
            let users = gruop_.user;
            return { x, users };
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.removeUser = removeUser;
