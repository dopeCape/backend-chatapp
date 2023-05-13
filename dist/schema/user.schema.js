"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
    },
    friends: [
        {
            userId: String,
            userName: String,
            profilePic: String,
            chatId: String,
            blocked: String,
            pending: String,
        },
    ],
});
exports.userSchema = userSchema;
