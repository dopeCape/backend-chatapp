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
exports.getGroupChatData = exports.createGroupChat = exports.addMemberToGroup = exports.removeMemeberFromGroup = void 0;
const db_config_1 = require("../config/db.config");
function getGroupChatData(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getGroupChatCollection)();
            let groupChat = yield collection.findOne({ groupId: groupId });
            return groupChat;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getGroupChatData = getGroupChatData;
function createGroupChat(groupChat) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getGroupChatCollection)();
            let newGroupChat = yield collection.create(groupChat);
            return newGroupChat;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createGroupChat = createGroupChat;
function addMemberToGroup(groupId, user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getGroupChatCollection)();
            let groupChat = yield collection.findOne({ groupId: groupId });
            groupChat.Members.push(user);
            let updatedGroup = yield collection.findOneAndUpdate({ groupId: groupId }, groupChat);
            return updatedGroup;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addMemberToGroup = addMemberToGroup;
function removeMemeberFromGroup(groupId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getGroupChatCollection)();
            let groupChat = yield collection.findOne({ groupId: groupId });
            let newGroupChat = groupChat.Members.filter((x) => {
                return x.userId != userId;
            });
            let updatedGroupChat_ = yield collection.findOneAndUpdate({ groupId: groupId }, newGroupChat);
            return updatedGroupChat_;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.removeMemeberFromGroup = removeMemeberFromGroup;
