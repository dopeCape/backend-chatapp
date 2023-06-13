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
exports.newMsgGroup = exports.editMsgGgroup = exports.deleteMsgGgroup = exports.removedFromGroup = exports.removeMember = exports.newMemberInGroup = exports.newGroupChat = exports.ably_endpoints = exports.newMemeberAdder = exports.newMemeberInWorkspce = void 0;
const ably_1 = __importDefault(require("ably"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_controller_1 = require("../controllers/users.controller");
const msg_controller_1 = require("../controllers/msg.controller");
dotenv_1.default.config(); //to read env files
const ably_key = process.env.ABLY; //ably api key
const ably_client = new ably_1.default.Realtime.Promise(ably_key);
//
// async function ably_endpoints() {
//   let server_channel = ably_client.channels.get("server"); // it is the main channel that every client connects to in order to make realtime cooms.
//
//   //when client sends request to another client
//   server_channel.subscribe("send-request", (msg) => {
//     let from = msg.data.from;
//     let to = msg.data.to;
//     let to_channel = ably_client.channels.get(to);
//     handleSendRequest([from, to], to_channel);
//   });
//
//   //when client accepts the request
//   server_channel.subscribe("accept-request", (msg) => {
//     let from = msg.data.from;
//     let to = msg.data.to;
//
//     let chatId = msg.data.chatId;
//     let from_channel = ably_client.channels.get(from);
//
//     handleAcceptRequest([from, to, chatId], from_channel);
//   });
//
//   //when client rejects the request
//   server_channel.subscribe("reject-request", (msg) => {
//     let from = msg.data.from;
//     let to = msg.data.to;
//     let chatId = msg.data.chatId;
//     let from_channel = ably_client.channels.get(from);
//
//     handleRejectRequest([from, to, chatId], from_channel);
//   });
//
//   //when client  blocks the a user
//   server_channel.subscribe("block-request", (msg) => {
//     let from = msg.data.from;
//     let to = msg.data.to;
//     let from_channel = ably_client.channels.get(to);
//
//     handleBlockUser([from, to], from_channel);
//   });
//
//   //when client  unblocks the a user
//   server_channel.subscribe("unblock-request", (msg) => {
//     let from = msg.data.from;
//     let to = msg.data.to;
//     let from_channel = ably_client.channels.get(to);
//
//     handleUnBlockUser([from, to], from_channel);
//   });
//
//   //when client  removes  a user as a friend
//   server_channel.subscribe("remove-request", (msg) => {
//     let from = msg.data.from;
//     let to = msg.data.to;
//     let from_channel = ably_client.channels.get(to);
//
//     handleRemoveFriend([from, to], from_channel);
//   });
//
//   server_channel.subscribe("new-msg", (data) => {
//     let channel = ably_client.channels.get(data.data.to);
//     let from_channel = ably_client.channels.get(data.data.from);
//
//     handleNewMsg(data.data, channel, from_channel);
//   });
//   server_channel.subscribe("delete-msg", (data) => {
//     let channel = ably_client.channels.get(data.data.to);
//
//     handleDeleteMsg(data.data, channel);
//   });
//   server_channel.subscribe("edit-msg", (data) => {
//     let channel = ably_client.channels.get(data.data.to);
//
//     handleEditMsg(data.data, channel);
//   });
//
//   server_channel.subscribe("user-typing", (data) => {
//     let channel = ably_client.channels.get(data.data.to);
//     handleUserTyping(data, channel);
//   });
//   server_channel.subscribe("user-nottyping", (data) => {
//     let channel = ably_client.channels.get(data.data.to);
//     handleUserNotTyping(data, channel);
//   });
// }
//
//
function ably_endpoints() {
    return __awaiter(this, void 0, void 0, function* () {
        let server_channel = ably_client.channels.get("server"); // it is the main channel that every client connects to in order to make realtime cooms.
        server_channel.subscribe("new-chat", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user1Channel = ably_client.channels.get(data.data.user1.user.id);
                let user2Channel = ably_client.channels.get(data.data.user2.user.id);
                yield (0, users_controller_1.handleNewChat)(data.data, { user1Channel, user2Channel });
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("new-msg-group", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let from_channel = ably_client.channels.get(data.data.from);
                let to = data.data.to;
                let _ = yield (0, msg_controller_1.handleNewMsgGroup)(data.data, { from_channel, to });
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("new-msg", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let from_channel = ably_client.channels.get(data.data.from);
                let to_channel = ably_client.channels.get(data.data.to);
                let _ = yield (0, msg_controller_1.handleNewMsg)(data.data, { from_channel, to_channel });
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("unread-chat", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, users_controller_1.handleRead)(data.data);
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("delete-msg", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let from_channel = ably_client.channels.get(data.data.from);
                let to_channel = ably_client.channels.get(data.data.to);
                let _ = yield (0, msg_controller_1.handleDeleteMsg)(data.data, { from_channel, to_channel });
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("delete-msg-group", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let from_channel = ably_client.channels.get(data.data.from);
                let to = data.data.to;
                let _ = yield (0, msg_controller_1.handleDeleteMsgGroup)(data.data, { from_channel, to });
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("edit-msg", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data);
                let from_channel = ably_client.channels.get(data.data.from);
                let to_channel = ably_client.channels.get(data.data.to);
                let _ = yield (0, msg_controller_1.handleEditMsg)(data.data, { from_channel, to_channel });
            }
            catch (error) {
                console.log(error);
            }
        }));
        server_channel.subscribe("edit-msg-group", (data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let from_channel = ably_client.channels.get(data.data.from);
                let to = data.data.to;
                let _ = yield (0, msg_controller_1.handleEditMsgGroup)(data.data, { from_channel, to });
            }
            catch (error) {
                console.log(error);
            }
        }));
    });
}
exports.ably_endpoints = ably_endpoints;
function newMemeberInWorkspce(userId, msg, newUser, chatId, workSpaceID) {
    return __awaiter(this, void 0, void 0, function* () {
        let userChannel = ably_client.channels.get(userId);
        yield userChannel.publish("new-memeber-workspace", {
            msg: msg,
            newUser: newUser,
            chiatId: chatId,
            workSpaceID: workSpaceID,
        });
        console.log("sent");
    });
}
exports.newMemeberInWorkspce = newMemeberInWorkspce;
function newMemberInGroup(userId, chatId, msg, newUser) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            yield userChannel.publish("new-memeber-group", {
                chatId,
                msg,
                newUser,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.newMemberInGroup = newMemberInGroup;
function newGroupChat(userId, GroupChat) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            yield userChannel.publish("new-group", {
                GroupChat,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.newGroupChat = newGroupChat;
function newMemeberAdder(userId, workspace, GroupChat) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            userChannel.publish("new-workspace", {
                workspace,
                GroupChat,
            });
            console.log("sent");
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.newMemeberAdder = newMemeberAdder;
function removedFromGroup(userId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            userChannel.publish("group-remove", {
                groupId,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.removedFromGroup = removedFromGroup;
function removeMember(userId, msg, rId, groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            userChannel.publish("group-remove-member", {
                msg,
                rId,
                groupId,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.removeMember = removeMember;
function newMsgGroup(userId, msg, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            userChannel.publish("new-msg-group", {
                msg,
                chatId,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.newMsgGroup = newMsgGroup;
function editMsgGgroup(userId, msg, chatId, msgId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            userChannel.publish("edit-msg-group", {
                msg,
                chatId,
                msgId,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.editMsgGgroup = editMsgGgroup;
function deleteMsgGgroup(userId, msgId, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let userChannel = ably_client.channels.get(userId);
            userChannel.publish("delete-msg-group", {
                msgId,
                chatId,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.deleteMsgGgroup = deleteMsgGgroup;
