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
exports.handleCreateGroupChat = void 0;
const groupchat_module_1 = require("../modules/groupchat.module");
const groupchat_module_2 = require("../modules/groupchat.module");
function handleCreateGroupChat(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let group = data.group;
            let from_channel = channel;
            let newGroupChat = (0, groupchat_module_2.createGroupChat)(group);
            channel.publish("group-created", newGroupChat);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleCreateGroupChat = handleCreateGroupChat;
function handleAddUser(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let updatedGroup = yield (0, groupchat_module_1.addMemberToGroup)(data.groupId, data.user);
            channel.pusblish("add-member", { updatedGroup });
        }
        catch (error) {
            throw error;
        }
    });
}
