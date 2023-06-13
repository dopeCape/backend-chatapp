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
exports.handleAddUnread = exports.handleRead = exports.handleNewChat = exports.handleAddToWorkSpace = exports.handleEmailInvtes = exports.handleFindUsers = exports.handleChelckInvite = exports.handleGetUserData = exports.handleGauth = exports.handleSetUserData = void 0;
const client_1 = require("@prisma/client");
const ably_confij_1 = require("../config/ably.confij");
function handleAddToWorkSpace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { chatWorkSpaceId, name, email, user_, workSpaceId } = req.body;
        try {
            let { msg_, workspace_, groupChatId, groupChat_, user_ } = yield (0, workspace_module_1.addUserToWorkSpace)(chatWorkSpaceId, name, email, "null", workSpaceId);
            console.log(workspace_.chatWorkSpace);
            yield (0, ably_service_1.newMemeberInWorkspce)("iEthxenlKU", msg_, user_, groupChatId, workSpaceId);
            workspace_.chatWorkSpace.map((x) => {
                if (x.user.id != user_.user.id) {
                    (0, ably_service_1.newMemeberInWorkspce)(x.user.id, msg_, user_, groupChatId, workSpaceId);
                }
                else {
                    (0, ably_service_1.newMemeberAdder)(user_.user.id, workspace_, groupChat_);
                }
            });
            res.send({
                msg: "added",
            });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleAddToWorkSpace = handleAddToWorkSpace;
function handleEmailInvtes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = req.body.email;
        let workspaceId = req.body.workspaceId;
        let role = req.body.role;
        try {
            let invite = yield (0, user_module_1.sendEmailInvite)(email, workspaceId, role);
            res.send({ invite });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleEmailInvtes = handleEmailInvtes;
function handleChelckInvite(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = req.body.email;
        try {
            if (email == "tmank14319@gmail.com" ||
                email === "timeo@mattyoungmedia.com ") {
                res.send({ msg: "ok" });
            }
            else {
                let invite = yield (0, user_module_1.getInvite)(email);
                if (invite == null) {
                    res.send({ msg: "nope" });
                }
                else {
                    res.send({ msg: "ok" });
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleChelckInvite = handleChelckInvite;
function handleFindUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let name = req.body.name;
        let workspaceId = req.body.workspaceId;
        try {
            let users = yield (0, user_module_1.searchUser)(name);
            res.send({ users });
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleFindUsers = handleFindUsers;
function handleGetUserData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let fireBaseid = req.params.userId;
        try {
            let msges;
            let user_data = yield (0, user_module_1.getUserData)(fireBaseid);
            let ably_token = yield (0, ably_confij_1.ablyTokenCreater)(fireBaseid);
            res.json({ user_data, ably_token });
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
        let { fireBaseid, name, profilePic, email } = req.body;
        try {
            let user = yield (0, user_module_1.getUserData)(fireBaseid);
            if (user != null) {
                res.json({ user_data: user });
                res.status(201);
            }
            else {
                let admin;
                if (email === "tmank14319@gmail.com") {
                    admin = true;
                }
                else {
                    admin = false;
                }
                let role = yield (0, user_module_1.getInvite)(email);
                let role_;
                if (role != null || email == "tmank14319@gmail.com") {
                    if (email == "tmank14319@gmail.com") {
                        role_ = client_1.Role.MEMBER;
                    }
                    else {
                        if (role.role == client_1.Role.MEMBER) {
                            role_ = client_1.Role.MEMBER;
                        }
                        else {
                            role_ = client_1.Role.EXTERNAL;
                        }
                    }
                    try {
                        let user_ = { fireBaseid, name, profilePic, email, admin, role_ };
                        let user_data = yield (0, user_module_1.createUser)(user_);
                        let ably_token = yield (0, ably_confij_1.ablyTokenCreater)(fireBaseid);
                        res.json({ user_data, ably_token });
                        res.status(201);
                    }
                    catch (error) {
                        next(error);
                    }
                }
                else {
                    res.send({ user_data: "not invited" });
                }
            }
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleGauth = handleGauth;
const user_module_1 = require("../modules/user.module");
const workspace_module_1 = require("../modules/workspace.module");
const ably_service_1 = require("../services/ably.service");
//
function handleSetUserData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { fireBaseid, name, profilePic, email, workspaceId, groupChatId } = req.body;
        let admin;
        console.log(email);
        if (email == "tmank14319@gmail.com" || email == "timeo@mattyoungmedia.com ") {
            admin = true;
        }
        else {
            admin = false;
        }
        let role = yield (0, user_module_1.getInvite)(email);
        let role_;
        if (role != null ||
            email == "tmank14319@gmail.com" ||
            email == "timeo@mattyoungmedia.com ") {
            if (email == "tmank14319@gmail.com" ||
                email == "timeo@mattyoungmedia.com ") {
                role_ = client_1.Role.MEMBER;
            }
            else {
                if (role.role == client_1.Role.MEMBER) {
                    role_ = client_1.Role.MEMBER;
                }
                else {
                    role_ = client_1.Role.EXTERNAL;
                }
            }
            try {
                let user_ = { fireBaseid, name, profilePic, email, admin, role_ };
                let user_data;
                if (email === "tmank14319@gmail.com" ||
                    email == "timeo@mattyoungmedia.com ") {
                    user_data = yield (0, user_module_1.createUser)(user_, null, null);
                }
                else {
                    let { created_user_: user_data, workspace_, msg_, user_: user__, groupChatId, } = yield (0, user_module_1.createUser)(user_, "x", "x");
                    console.log(user_data);
                    yield Promise.all(workspace_.chatWorkSpace.map((x) => __awaiter(this, void 0, void 0, function* () {
                        if (x.user.id != user__.user.id) {
                            console.log(x.user.id, user__.user.id);
                            yield (0, ably_service_1.newMemeberInWorkspce)(x.user.id, msg_, user__, groupChatId, user_data.chatWorkSpaces.workspaces[0].id);
                        }
                    })));
                }
                let ably_token = yield (0, ably_confij_1.ablyTokenCreater)(fireBaseid);
                res.json({ user_data, ably_token });
                res.status(201);
            }
            catch (error) {
                next(error);
            }
        }
        else {
            res.send({ user_data: "not invited" });
        }
    });
}
exports.handleSetUserData = handleSetUserData;
function handleNewChat(data, channel) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user1 = data.user1;
            let user2 = data.user2;
            let workspace = data.workspace;
            let content = data.content;
            let type = data.type;
            let url = data.url;
            let { toSendUser1: user1_, toSendUser2: user2_ } = yield (0, user_module_1.makeUserAFriend)(user1, user2, workspace, content, type, url);
            let { user1Channel, user2Channel } = channel;
            user1Channel.publish("new-chat", { data: user1_ });
            user2Channel.publish("new-chat", { data: user2_ });
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.handleNewChat = handleNewChat;
function handleAddUnread(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let friendId = data.friendId;
            yield (0, user_module_1.incrementUnread)(friendId);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleAddUnread = handleAddUnread;
function handleRead(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let friendId = data.id;
            console.log(data);
            yield (0, user_module_1.ZeroUnread)(friendId);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.handleRead = handleRead;
