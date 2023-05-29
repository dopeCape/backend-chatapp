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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEditMsg = exports.handleDeleteMsg = exports.handleGetAllMsg = exports.handleNewMsg = void 0;
const date_and_time_1 = __importDefault(require("date-and-time"));
const msges_module_1 = require("../modules/msges.module");
const uuid_1 = require("uuid");
function handleNewMsg(data, channel, from_channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let { msg, from, to, chatId } = data;
        let now = new Date();
        let date_ = date_and_time_1.default.format(now, "YYYY/MM/DD HH:mm:ss");
        let msge = {
            msgId: (0, uuid_1.v4)(),
            msg: msg,
            from: from,
            to: to,
            date: date_,
        };
        try {
            let msg = yield (0, msges_module_1.addMsg)(msge, chatId);
            console.log(msg);
            channel.publish("new-msg", msg);
            from_channel.publish("new-msg", msg);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleNewMsg = handleNewMsg;
function handleGetAllMsg(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { id } = req.params;
        let chatId = id;
        try {
            let msges = yield (0, msges_module_1.getAllMsges)(chatId);
            if (msges == null) {
                res.json({ msges: { msges: [] } });
                res.status(201);
            }
            else {
                res.json({ msges });
                res.status(201);
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleGetAllMsg = handleGetAllMsg;
function handleDeleteMsg(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let { msgId, chatId } = data;
        try {
            let msg = yield (0, msges_module_1.deleteMsg)(chatId, msgId);
            channel.publish("delete-msg", msg);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleDeleteMsg = handleDeleteMsg;
function handleEditMsg(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let { msgId, chatId } = data;
        try {
            let msg = yield (0, msges_module_1.deleteMsg)(chatId, msgId);
            channel.publish("edit-msg", msg);
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleEditMsg = handleEditMsg;
