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
exports.handleUnBlockUser = exports.handleBlockUser = exports.handleRejectRequest = exports.handleRemoveFriend = exports.handleDelteAllUsers = exports.handleAcceptRequest = exports.handleSendRequest = exports.handleSearchUser = exports.handleGauth = exports.handleChelckUserName = exports.handleSetUserData = exports.handleGetUserData = void 0;
const ably_confij_1 = require("../config/ably.confij");
const msges_module_1 = require("../modules/msges.module");
const user_module_1 = require("../modules/user.module");
// async function getAllChat(user_data) {
//   return new Promise(function(resolve) {
//
//     console.log(msg);
//     resolve(msg);
//   });
// }
function handleGetUserData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let userId = req.params.userId;
        try {
            let msges;
            let user_data = yield (0, user_module_1.getUserData)(userId);
            let ably_token = yield (0, ably_confij_1.ablyTokenCreater)(userId);
            let msg = [];
            yield Promise.all(user_data.friends.map((x) => __awaiter(this, void 0, void 0, function* () {
                let msg_ = yield (0, msges_module_1.getAllMsges)(x.chatId);
                if (msg_ !== null) {
                    msg.push(msg_);
                }
            })));
            res.json({ user_data, ably_token, msg });
            res.status(201);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleGetUserData = handleGetUserData;
function handleGauth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { userId, userName, profilePic, email } = req.body;
        try {
            let user = yield (0, user_module_1.getUserData)(userId);
            if (user != null) {
                res.json({ user_data: user });
                res.status(201);
            }
            else {
                try {
                    let user_ = { userId, userName, profilePic, email };
                    let user = yield (0, user_module_1.createUser)(user_);
                    res.json({ user_data: user });
                    res.status(201);
                }
                catch (error) {
                    next(error);
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleGauth = handleGauth;
function handleSearchUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { q: query } = req.params;
        try {
            let users_ = yield (0, user_module_1.searchUsers)(query);
            res.status(200);
            res.json({
                users: users_,
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleSearchUser = handleSearchUser;
function handleChelckUserName(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let userName = req.body.userName;
        try {
            let user = yield (0, user_module_1.findUserName)(userName);
            res.json({ userName: user === null || user === void 0 ? void 0 : user.userName });
            res.status(201);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleChelckUserName = handleChelckUserName;
function handleSetUserData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { userId, userName, profilePic, email } = req.body;
        let user = {
            userId,
            userName,
            profilePic,
            email,
        };
        try {
            let new_user = yield (0, user_module_1.createUser)(user);
            res.json({ user_data: new_user });
            res.status(201);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleSetUserData = handleSetUserData;
function handleSendRequest(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let [from, to] = data;
        try {
            let [_, user] = yield (0, user_module_1.sendRequest)(from, to);
            channel.publish("send-request", user);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleSendRequest = handleSendRequest;
function handleDelteAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, user_module_1.deleteAllUsers)();
            res.send("delted all users");
        }
        catch (error) { }
    });
}
exports.handleDelteAllUsers = handleDelteAllUsers;
function handleAcceptRequest(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let [from, to, chatId] = data;
        try {
            let [from_user] = yield (0, user_module_1.acceptRequest)(from, to, chatId);
            channel.publish("accept-request", { from_user, chatId });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleAcceptRequest = handleAcceptRequest;
function handleRejectRequest(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let [from, to] = data;
        try {
            let from_user = yield (0, user_module_1.rejectRequest)(from, to);
            channel.publish("reject-request", from_user);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleRejectRequest = handleRejectRequest;
function handleBlockUser(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let [from, to] = data;
        try {
            let to_user = yield (0, user_module_1.blockRequest)(from, to);
            channel.publish("block-request", to_user);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleBlockUser = handleBlockUser;
function handleUnBlockUser(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let [from, to] = data;
        try {
            let to_user = yield (0, user_module_1.unBlockRequest)(from, to);
            channel.publish("unblock-request", to_user);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleUnBlockUser = handleUnBlockUser;
function handleRemoveFriend(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        let [from, to] = data;
        try {
            let to_user = yield (0, user_module_1.removeFriendRequest)(from, to);
            channel.publish("unblock-request", to_user);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleRemoveFriend = handleRemoveFriend;
