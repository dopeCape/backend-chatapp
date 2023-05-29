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
exports.getGroupChatCollection = exports.getMsgCollection = exports.getUserCollection = exports.getDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_schema_1 = require("../schema/user.schema");
const msg_schema_1 = require("../schema/msg.schema");
const groupchat_schema_1 = require("../schema/groupchat.schema");
dotenv_1.default.config();
const MONGO_URI = process.env.URI;
let DB;
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            DB = yield mongoose_1.default.connect(MONGO_URI);
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.connectDB = connectDB;
function getDB() {
    return DB;
}
exports.getDB = getDB;
function getUserCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userCol = mongoose_1.default.model("users", user_schema_1.userSchema);
            return userCol;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getUserCollection = getUserCollection;
function getMsgCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let msgCol = mongoose_1.default.model("msges", msg_schema_1.msgSchema);
            return msgCol;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getMsgCollection = getMsgCollection;
function getGroupChatCollection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let msgCol = mongoose_1.default.model("groupChat", groupchat_schema_1.groupChatSchema);
            return msgCol;
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.getGroupChatCollection = getGroupChatCollection;
