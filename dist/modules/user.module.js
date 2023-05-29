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
exports.removeFriendRequest = exports.blockRequest = exports.unBlockRequest = exports.sendRequest = exports.acceptRequest = exports.rejectRequest = exports.searchUsers = exports.findUserName = exports.getUserData = exports.setPending = exports.blockFriend = exports.removeFriend = exports.createUser = exports.addFriend = exports.deleteAllUsers = void 0;
const db_config_1 = require("../config/db.config");
const helper_1 = require("../utils/helper");
function getUserData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let user = yield collection.findOne({ userId: userId });
            return user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.getUserData = getUserData;
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let newUser = yield collection.create(user);
            return newUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createUser = createUser;
function findUserName(userName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let user = yield collection.findOne({ userName: userName });
            console.log(user);
            return user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.findUserName = findUserName;
function addFriend(userId, friend) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let user = yield collection.findOne({ userId: userId });
            user.friends.push(friend);
            let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addFriend = addFriend;
function removeFriend(userId, friendUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let user = yield collection.findOne({ userId: userId });
            user.friends = user.friends.filter((x) => {
                return x.userId === friendUserId;
            });
            let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.removeFriend = removeFriend;
function blockFriend(userId, friendUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let user = yield collection.findOne({ userId: userId });
            user.friends.forEach((x, i) => {
                if (x.userId === friendUserId) {
                    if ((x.blocked = userId)) {
                        x.blocked = "";
                    }
                    else {
                        x.blocked = userId;
                    }
                }
            });
            let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.blockFriend = blockFriend;
function setPending(userId, pendingId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let user = yield collection.findOne({ userId: userId });
            user.friends.forEach((x, i) => {
                if (x.userId === userId) {
                    if (x.pending != "") {
                        if (pendingId == "rejected") {
                            x.blocked = "rejected";
                        }
                        x.blocked = "accepted";
                    }
                    else {
                        x.pending = pendingId;
                    }
                }
            });
            let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.setPending = setPending;
function searchUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            const searchResults = yield collection
                .find({
                $or: [{ userName: { $regex: query, $options: "i" } }],
            })
                .select("userName email userId profilePic");
            return searchResults;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.searchUsers = searchUsers;
function acceptRequest(from, to, chatId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let msg_collection = yield (0, db_config_1.getMsgCollection)();
            let from_user = yield collection.findOne({ userId: from });
            let to_user = yield collection.findOne({ userId: to });
            let msg = yield msg_collection.findOne({ chatId: chatId });
            if (msg === null) {
                msg_collection.create({ chatId: chatId, msges: [] });
            }
            let from_index;
            from_user.requests.forEach((x, i) => {
                if (x.userId == to) {
                    let user;
                    from_index = i;
                    user = x;
                    user.chatId = chatId;
                    user.pending = "accepted";
                    from_user.friends.push(user);
                    console.log(user);
                }
            });
            from_user.requests = from_user.requests.filter((x) => {
                return x.userId != to;
            });
            from_user.friends = (0, helper_1.array_move)(from_user.friends, from_index, 0);
            let to_index;
            to_user.requests.forEach((x, i) => {
                if (x.userId == from) {
                    let user;
                    user = x;
                    user.pending = "accepted";
                    user.chatId = chatId;
                    to_index = i;
                    to_user.friends.push(user);
                }
            });
            to_user.requests = to_user.requests.filter((x) => {
                return x.userId != from;
            });
            to_user.friends = (0, helper_1.array_move)(to_user.friends, to_index, 0);
            let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
            let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
            return [from_user, chatId];
        }
        catch (error) {
            throw error;
        }
    });
}
exports.acceptRequest = acceptRequest;
function rejectRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let from_user = yield collection.findOne({ userId: from });
            let to_user = yield collection.findOne({ userId: to });
            let from_index;
            from_user.friends.forEach((x, i) => {
                if (x.userId == to) {
                    from_index = i;
                    x.pending = "rejected";
                }
            });
            from_user.friends = (0, helper_1.array_move)(from_user.friends, from_index, 0);
            let to_index;
            to_user.requests = to_user.requests.filter((x, i) => {
                return x.userId != from_user.userId;
            });
            to_user.friends = (0, helper_1.array_move)(to_user.friends, to_index, 0);
            let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
            let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
            return from_user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.rejectRequest = rejectRequest;
function blockRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let from_user = yield collection.findOne({ userId: from });
            let to_user = yield collection.findOne({ userId: to });
            from_user.friends.forEach((x) => {
                if (x.userId == to) {
                    x.blocked = from;
                }
            });
            to_user.friends.forEach((x) => {
                if (x.userId == from) {
                    x.blocked = from;
                }
            });
            let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
            let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
            return to_user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.blockRequest = blockRequest;
function unBlockRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let from_user = yield collection.findOne({ userId: from });
            let to_user = yield collection.findOne({ userId: to });
            from_user.friends.forEach((x) => {
                if (x.userId == to) {
                    x.blocked = "unblocked";
                }
            });
            to_user.friends.forEach((x) => {
                if (x.userId == from) {
                    x.blocked = "unblocked";
                }
            });
            let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
            let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
            return to_user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.unBlockRequest = unBlockRequest;
function removeFriendRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let from_user = yield collection.findOne({ userId: from });
            let to_user = yield collection.findOne({ userId: to });
            from_user.friends = from_user.friends.filter((x) => {
                return x.userId !== to;
            });
            to_user.friends = to_user.friends.filter((x) => {
                return x.userId !== from;
            });
            let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
            let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
            return to_user;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.removeFriendRequest = removeFriendRequest;
function sendRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            let from_user = yield collection.findOne({ userId: from });
            let to_user = yield collection.findOne({ userId: to });
            let from_user_ = {
                userId: from_user.userId,
                userName: from_user.userName,
                profilePic: from_user.profilePic,
                pending: from,
            };
            let to_user_ = {
                userId: to_user.userId,
                userName: to_user.userName,
                profilePic: to_user.profilePic,
                pending: from,
            };
            let y = true;
            from_user.friends.forEach((x) => {
                if (x.userId === to) {
                    y = false;
                }
            });
            if (y) {
                from_user.requests.unshift(to_user_);
                to_user.requests.unshift(from_user_);
                let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                return [from_user, to_user];
            }
            else {
                return ["request already sent", "request already sent"];
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.sendRequest = sendRequest;
function deleteAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let colleciton = yield (0, db_config_1.getUserCollection)();
            colleciton.deleteMany({});
        }
        catch (error) { }
    });
}
exports.deleteAllUsers = deleteAllUsers;
