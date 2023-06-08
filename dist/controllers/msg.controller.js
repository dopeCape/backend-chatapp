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
exports.handleNewMsgGroup = exports.handleDeleteMsgGroup = exports.handleEditMsgGroup = exports.handleEditMsg = exports.handleDeleteMsg = exports.handleNewMsg = void 0;
const msges_module_1 = require("../modules/msges.module");
const ably_service_1 = require("../services/ably.service");
function handleNewMsg(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { content, type, from, chatId, url } = data;
            console.log(content, type, from, chatId, url);
            let msg = yield (0, msges_module_1.addMsg)(chatId, type, content, from, url, false);
            let { from_channel, to_channel } = channel;
            from_channel.publish("new-msg", {
                data: msg,
            });
            to_channel.publish("new-msg", {
                data: msg,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleNewMsg = handleNewMsg;
function handleDeleteMsg(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { msgId: msgid, chatId } = data;
            let _ = yield (0, msges_module_1.deleteMsg)(msgid);
            let { from_channel, to_channel } = channel;
            from_channel.publish("delete-msg", {
                msgid,
                chatId,
            });
            to_channel.publish("delete-msg", {
                msgid,
                chatId,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleDeleteMsg = handleDeleteMsg;
function handleEditMsg(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { msgId, content, chatId } = data;
            yield (0, msges_module_1.editMsg)(content, msgId);
            let { from_channel, to_channel } = channel;
            from_channel.publish("edit-msg", {
                msgId,
                chatId,
                content,
            });
            to_channel.publish("edit-msg", {
                msgId,
                chatId,
                content,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleEditMsg = handleEditMsg;
function handleEditMsgGroup(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { msgId, content, chatId } = data;
            yield (0, msges_module_1.editMsg)(content, msgId);
            let { to } = channel;
            to.forEach((x) => {
                console.log(x);
                (0, ably_service_1.editMsgGgroup)(x.user.id, content, chatId, msgId);
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleEditMsgGroup = handleEditMsgGroup;
function handleDeleteMsgGroup(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { msgId: msgid, chatId } = data;
            let _ = yield (0, msges_module_1.deleteMsg)(msgid);
            let { to } = channel;
            to.forEach((x) => {
                (0, ably_service_1.deleteMsgGgroup)(x.user.id, msgid, chatId);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleDeleteMsgGroup = handleDeleteMsgGroup;
function handleNewMsgGroup(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { content, type, from, chatId, url } = data;
            let msg = yield (0, msges_module_1.addMsg)(chatId, type, content, from, url, true);
            let { to } = channel;
            to.forEach((x) => {
                (0, ably_service_1.newMsgGroup)(x.user.id, msg, chatId);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleNewMsgGroup = handleNewMsgGroup;
