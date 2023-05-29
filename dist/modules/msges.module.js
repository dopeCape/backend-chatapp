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
exports.getAllMsges = exports.editMsg = exports.deleteMsg = exports.addMsg = void 0;
const db_config_1 = require("../config/db.config");
const date_and_time_1 = __importDefault(require("date-and-time"));
function addMsg(msg, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            let msges;
            msges = yield collection.findOne({ chatId: chatId });
            if (msges == null) {
                msges = yield collection.create({ chatId: chatId });
                msges.msges = [msg];
            }
            else {
                if (msges.msges) {
                    msges.msges.push(msg);
                }
                else {
                    msges.msges = [msg];
                }
            }
            yield collection.updateOne({ chatId: chatId }, msges);
            return msges;
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
            let msges = yield collection.findOne({ chatId: chatId });
            msges.msges = msges.msges.filter((x) => {
                return x.msgId != msgId;
            });
            yield collection.updateOne({ chatId: chatId }, msges);
            return msges;
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
            let msges = yield collection.findOne({ chatId: chatId });
            let now = new Date();
            let date_ = date_and_time_1.default.format(now, "YYYY/MM/DD HH:mm:ss");
            msges.msges.forEach((x) => {
                if (x.msgId == msgId) {
                    x.msg = msg;
                    x.edited = true;
                    x.date = date_;
                }
            });
            yield collection.updateOne({ chatId: chatId }, msges);
            return msges;
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
            let msges = yield collection.findOne({ chatId: chatId });
            return msges;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getAllMsges = getAllMsges;
function deleteAllMsg(chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        //to drop db after tests
        try {
            let collection = yield (0, db_config_1.getMsgCollection)();
            let msges = yield collection.findOneAndDelete({ chatId: chatId });
        }
        catch (error) {
            throw error;
        }
    });
}
