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
exports.editMsg = exports.deleteMsg = exports.addMsg = void 0;
const db_config_1 = require("../config/db.config");
const user_module_1 = require("./user.module");
function addMsg(chatId, type, content, from, url, group, friendId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (url == undefined) {
            url = "";
        }
        try {
            let prisma = (0, db_config_1.getDb)();
            if (!group) {
                let _ = yield prisma.msges.create({
                    data: {
                        type: type,
                        Chat: {
                            connect: { id: chatId },
                        },
                        content: content,
                        url: url,
                        from: {
                            connect: {
                                id: from,
                            },
                        },
                    },
                    include: {
                        replys: true,
                        from: true,
                    },
                });
                (0, user_module_1.incrementUnread)(friendId);
                let msg = _;
                return { msg };
            }
            else {
                let _ = yield prisma.msges.create({
                    data: {
                        type: type,
                        groupchat: {
                            connect: { id: chatId },
                        },
                        content: content,
                        url: url,
                        from: {
                            connect: {
                                id: from,
                            },
                        },
                    },
                    include: {
                        replys: true,
                        from: true,
                    },
                });
                let msg = _;
                return { msg };
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.addMsg = addMsg;
function deleteMsg(msgid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let prisma = (0, db_config_1.getDb)();
            let deletedmsg = yield prisma.msges.delete({
                where: {
                    id: msgid,
                },
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteMsg = deleteMsg;
function editMsg(content, msgId) {
    return __awaiter(this, void 0, void 0, function* () {
        let prisma = (0, db_config_1.getDb)();
        try {
            let editedMsg = yield prisma.msges.update({
                where: {
                    id: msgId,
                },
                data: {
                    content: content,
                },
            });
        }
        catch (error) {
            console.log(error, "hiii");
        }
    });
}
exports.editMsg = editMsg;
