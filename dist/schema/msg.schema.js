"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgSchema = void 0;
const mongoose_1 = require("mongoose");
const msgSchema = new mongoose_1.Schema({
    chatId: String,
    msges: [
        {
            msgId: String,
            from: String,
            msg: String,
            date: String,
            edited: Boolean,
        },
    ],
});
exports.msgSchema = msgSchema;
