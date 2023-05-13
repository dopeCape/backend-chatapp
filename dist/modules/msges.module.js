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
exports.getAllMsges = exports.editMsg = exports.deleteMsg = exports.addMsg = void 0;
const db_config_1 = require("../config/db.config");
function addMsg(msg, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            let msges;
            try {
                msges = yield collection.findOne({ chatId: chatId });
                if (msges == null) {
                    try {
                        msges = yield collection.create({ chatId: chatId });
                        msges.msges = [msg];
                    }
                    catch (error) {
                        throw error;
                    }
                }
                else {
                    if (msges.msges) {
                        msges.msges.push(msg);
                    }
                    else {
                        msges.msges = [msg];
                    }
                }
                try {
                    yield collection.updateOne({ chatId: chatId }, msges);
                    return msges;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addMsg = addMsg;
function deleteMsg(chatId, msgId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            try {
                let msges = yield collection.findOne({ chatId: chatId });
                try {
                    msges.msges = msges.msges.filter((x) => {
                        return x.msgId != msgId;
                    });
                    yield collection.updateOne({ chatId: chatId }, msges);
                    return msges;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deleteMsg = deleteMsg;
function editMsg(chatId, msgId, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            try {
                let msges = yield collection.findOne({ chatId: chatId });
                try {
                    msges.msges.forEach((x) => {
                        if (x.msgId == msgId) {
                            x.msg = msg;
                        }
                    });
                    yield collection.updateOne({ chatId: chatId }, msges);
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.editMsg = editMsg;
function getAllMsges(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            try {
                let msges = yield collection.findOne({ chatId: chatId });
                return msges;
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getAllMsges = getAllMsges;
function deleteAllMsg(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            try {
                let msges = yield collection.findOneAndDelete({ chatId: chatId });
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
