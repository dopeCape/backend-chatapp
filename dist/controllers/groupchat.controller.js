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
exports.handleRemoveUser = exports.handleAddUseToGroup = exports.handleCreateNewGroup = void 0;
const groupchat_module_1 = require("../modules/groupchat.module");
const ably_service_1 = require("../services/ably.service");
function handleCreateNewGroup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { workspaceId, users, user, name } = req.body;
            console.log(req.body);
            let group_ = yield (0, groupchat_module_1.createNewGruop)(workspaceId, users, user, name);
            group_.user.forEach((user) => {
                (0, ably_service_1.newGroupChat)(user.user.id, group_);
            });
            res.send("created");
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleCreateNewGroup = handleCreateNewGroup;
const chelckIfArrayExistss = (array, element) => {
    let y = false;
    array.forEach((x) => {
        if (x.id == element.id) {
            y = true;
        }
    });
    return y;
};
function handleAddUseToGroup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { users, workspaceId, groupChatId, name } = req.body;
            let groupChat = yield (0, groupchat_module_1.addMemebToGroup)(users, workspaceId, groupChatId, name);
            groupChat.user.forEach((x) => {
                if (chelckIfArrayExistss(users, x)) {
                    (0, ably_service_1.newGroupChat)(x.user.id, groupChat);
                }
                else {
                    (0, ably_service_1.newMemberInGroup)(x.user.id, groupChat.id, groupChat.msges.at(-1), users);
                }
            });
            res.send("ok");
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleAddUseToGroup = handleAddUseToGroup;
function handleRemoveUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { msg, userid: userId, groupId, userxid } = req.body;
            let { x, users } = yield (0, groupchat_module_1.removeUser)(msg, userId, groupId);
            console.log(users);
            users.forEach((y) => {
                if (y.id === userId) {
                }
                else {
                    (0, ably_service_1.removeMember)(y.user.id, x, userId, groupId);
                }
            });
            (0, ably_service_1.removedFromGroup)(userxid, groupId);
            res.send("ok");
        }
        catch (error) {
            next(error);
        }
    });
}
exports.handleRemoveUser = handleRemoveUser;
