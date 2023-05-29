"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupChatSchema = void 0;
const mongoose_1 = require("mongoose");
const groupChatSchema = new mongoose_1.Schema({
    groupId: {
        required: true,
        type: String,
    },
    groupName: String,
    chatId: String,
    createdOn: String,
    Members: [
        {
            userName: String,
            userId: String,
            profilePic: String,
        },
    ],
    groupAdmin: String,
});
exports.groupChatSchema = groupChatSchema;
