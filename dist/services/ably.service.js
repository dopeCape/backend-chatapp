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
exports.ably_endpoints = exports.ably_client = void 0;
const ably_1 = __importDefault(require("ably"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_controller_1 = require("../controllers/users.controller");
const msg_controller_1 = require("../controllers/msg.controller");
dotenv_1.default.config(); //to read env files
const ably_key = process.env.ABLY; //ably api key
const ably_client = new ably_1.default.Realtime.Promise(ably_key);
exports.ably_client = ably_client;
function ably_endpoints() {
    return __awaiter(this, void 0, void 0, function* () {
        let server_channel = ably_client.channels.get("server"); // it is the main channel that every client connects to in order to make realtime cooms.
        //when client sends request to another client
        server_channel.subscribe("send-request", (msg) => {
            let from = msg.data.from;
            let to = msg.data.to;
            let to_channel = ably_client.channels.get(to);
            (0, users_controller_1.handleSendRequest)([from, to], to_channel);
        });
        //when client accepts the request
        server_channel.subscribe("accept-request", (msg) => {
            let from = msg.data.from;
            let to = msg.data.to;
            let chatId = msg.data.chatId;
            let from_channel = ably_client.channels.get(from);
            (0, users_controller_1.handleAcceptRequest)([from, to, chatId], from_channel);
        });
        //when client rejects the request
        server_channel.subscribe("reject-request", (msg) => {
            let from = msg.data.from;
            let to = msg.data.to;
            let chatId = msg.data.chatId;
            let from_channel = ably_client.channels.get(from);
            (0, users_controller_1.handleRejectRequest)([from, to, chatId], from_channel);
        });
        //when client  blocks the a user
        server_channel.subscribe("block-request", (msg) => {
            let from = msg.data.from;
            let to = msg.data.to;
            let from_channel = ably_client.channels.get(to);
            (0, users_controller_1.handleBlockUser)([from, to], from_channel);
        });
        //when client  unblocks the a user
        server_channel.subscribe("unblock-request", (msg) => {
            let from = msg.data.from;
            let to = msg.data.to;
            let from_channel = ably_client.channels.get(to);
            (0, users_controller_1.handleUnBlockUser)([from, to], from_channel);
        });
        //when client  removes  a user as a friend
        server_channel.subscribe("remove-request", (msg) => {
            let from = msg.data.from;
            let to = msg.data.to;
            let from_channel = ably_client.channels.get(to);
            (0, users_controller_1.handleRemoveFriend)([from, to], from_channel);
        });
        server_channel.subscribe("new-msg", (data) => {
            let channel = ably_client.channels.get(data.data.to);
            let from_channel = ably_client.channels.get(data.data.from);
            (0, msg_controller_1.handleNewMsg)(data.data, channel, from_channel);
        });
        server_channel.subscribe("delete-msg", (data) => {
            let channel = ably_client.channels.get(data.data.to);
            (0, msg_controller_1.handleDeleteMsg)(data.data, channel);
        });
        server_channel.subscribe("edit-msg", (data) => {
            let channel = ably_client.channels.get(data.data.to);
            (0, msg_controller_1.handleEditMsg)(data.data, channel);
        });
        server_channel.subscribe("user-typing", (data) => {
            let channel = ably_client.channels.get(data.data.to);
            (0, users_controller_1.handleUserTyping)(data, channel);
        });
        server_channel.subscribe("user-nottyping", (data) => {
            let channel = ably_client.channels.get(data.data.to);
            (0, users_controller_1.handleUserNotTyping)(data, channel);
        });
    });
}
exports.ably_endpoints = ably_endpoints;
