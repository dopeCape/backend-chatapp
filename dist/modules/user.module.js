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
const uuid_1 = require("uuid");
function getUserData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            try {
                let user = yield collection.findOne({ userId: userId });
                return user;
            }
            catch (error) {
                throw error;
            }
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
            try {
                let newUser = yield collection.create(user);
                return newUser;
            }
            catch (error) {
                throw error;
            }
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
            try {
                let user = yield collection.findOne({ userName: userName });
                console.log(user);
                return user;
            }
            catch (error) {
                throw error;
            }
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
            try {
                let user = yield collection.findOne({ userId: userId });
                user.friends.push(friend);
                try {
                    let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
                    return updatedUser;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
                let user = yield collection.findOne({ userId: userId });
                user.friends = user.friends.filter((x) => {
                    return x.userId === friendUserId;
                });
                try {
                    let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
                    return updatedUser;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
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
                try {
                    let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
                    return updatedUser;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
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
                try {
                    let updatedUser = yield collection.findOneAndUpdate({ userId: userId }, user);
                    return updatedUser;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
        }
        catch (error) {
            throw error;
        }
    });
}
exports.setPending = setPending;
function searchUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(query);
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
function acceptRequest(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let collection = yield (0, db_config_1.getUserCollection)();
            try {
                let from_user = yield collection.findOne({ userId: from });
                let to_user = yield collection.findOne({ userId: to });
                let chatId = (0, uuid_1.v4)();
                from_user.friends.forEach((x) => {
                    if (x.userId == to) {
                        x.pending = "accepted";
                        x.chatId = chatId;
                    }
                });
                to_user.friends.forEach((x) => {
                    if (x.userId == from) {
                        x.pending = "accepted";
                        x.chatId = chatId;
                    }
                });
                try {
                    let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                    let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                    return from_user;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
                let from_user = yield collection.findOne({ userId: from });
                let to_user = yield collection.findOne({ userId: to });
                from_user.friends.forEach((x) => {
                    if (x.userId == to) {
                        x.pending = "rejected";
                    }
                });
                to_user.friends.forEach((x) => {
                    if (x.userId == from) {
                        x.pending = "rejected";
                    }
                });
                try {
                    let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                    let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                    return from_user;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
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
                try {
                    let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                    let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                    return to_user;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
                let from_user = yield collection.findOne({ userId: from });
                let to_user = yield collection.findOne({ userId: to });
                from_user.friends.forEach((x) => {
                    if (x.userId == to) {
                        x.blocked = "";
                    }
                });
                to_user.friends.forEach((x) => {
                    if (x.userId == from) {
                        x.blocked = "";
                    }
                });
                try {
                    let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                    let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                    return to_user;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
                let from_user = yield collection.findOne({ userId: from });
                let to_user = yield collection.findOne({ userId: to });
                from_user.friends = from_user.friends.filter((x) => {
                    return x.userId !== to;
                });
                to_user.friends = to_user.friends.filter((x) => {
                    return x.userId !== from;
                });
                try {
                    let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                    let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                    return to_user;
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
            }
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
            try {
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
                from_user.friends.push(to_user_);
                to_user.friends.push(from_user_);
                try {
                    let user_from_send = yield collection.findOneAndUpdate({ userId: from }, from_user);
                    let user_to_send = yield collection.findOneAndUpdate({ userId: to }, to_user);
                    return [from_user, to_user];
                }
                catch (error) {
                    throw error;
                }
            }
            catch (error) {
                throw error;
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
