import { getMsgCollection, getUserCollection } from "../config/db.config";
import { array_move } from "../utils/helper";

async function getUserData(userId) {
  try {
    let collection = await getUserCollection();
    let user = await collection.findOne({ userId: userId });
    return user;
  } catch (error) {
    throw error;
  }
}

async function createUser(user) {
  try {
    let collection = await getUserCollection();
    let newUser = await collection.create(user);
    return newUser;
  } catch (error) {
    throw error;
  }
}

async function findUserName(userName) {
  try {
    let collection = await getUserCollection();
    let user = await collection.findOne({ userName: userName });
    console.log(user);

    return user;
  } catch (error) {
    throw error;
  }
}

async function addFriend(userId, friend) {
  try {
    let collection = await getUserCollection();

    let user = await collection.findOne({ userId: userId });
    user.friends.push(friend);
    let updatedUser = await collection.findOneAndUpdate(
      { userId: userId },
      user
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function removeFriend(userId, friendUserId) {
  try {
    let collection = await getUserCollection();
    let user = await collection.findOne({ userId: userId });
    user.friends = user.friends.filter((x) => {
      return x.userId === friendUserId;
    });

    let updatedUser = await collection.findOneAndUpdate(
      { userId: userId },
      user
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function blockFriend(userId, friendUserId) {
  try {
    let collection = await getUserCollection();
    let user = await collection.findOne({ userId: userId });
    user.friends.forEach((x, i) => {
      if (x.userId === friendUserId) {
        if ((x.blocked = userId)) {
          x.blocked = "";
        } else {
          x.blocked = userId;
        }
      }
    });

    let updatedUser = await collection.findOneAndUpdate(
      { userId: userId },
      user
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

async function setPending(userId, pendingId) {
  try {
    let collection = await getUserCollection();
    let user = await collection.findOne({ userId: userId });
    user.friends.forEach((x, i) => {
      if (x.userId === userId) {
        if (x.pending != "") {
          if (pendingId == "rejected") {
            x.blocked = "rejected";
          }
          x.blocked = "accepted";
        } else {
          x.pending = pendingId;
        }
      }
    });

    let updatedUser = await collection.findOneAndUpdate(
      { userId: userId },
      user
    );
    return updatedUser;
  } catch (error) {
    throw error;
  }
}
async function searchUsers(query) {
  try {
    let collection = await getUserCollection();
    const searchResults = await collection
      .find({
        $or: [{ userName: { $regex: query, $options: "i" } }],
      })
      .select("userName email userId profilePic");

    return searchResults;
  } catch (error) {
    throw error;
  }
}
async function acceptRequest(from, to, chatId) {
  try {
    let collection = await getUserCollection();
    let msg_collection = await getMsgCollection();
    let from_user = await collection.findOne({ userId: from });
    let to_user = await collection.findOne({ userId: to });

    let msg = await msg_collection.findOne({ chatId: chatId });

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

    from_user.friends = array_move(from_user.friends, from_index, 0);

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

    to_user.friends = array_move(to_user.friends, to_index, 0);
    let user_from_send = await collection.findOneAndUpdate(
      { userId: from },
      from_user
    );

    let user_to_send = await collection.findOneAndUpdate(
      { userId: to },
      to_user
    );
    return [from_user, chatId];
  } catch (error) {
    throw error;
  }
}
async function rejectRequest(from, to) {
  try {
    let collection = await getUserCollection();
    let from_user = await collection.findOne({ userId: from });
    let to_user = await collection.findOne({ userId: to });

    let from_index;
    from_user.friends.forEach((x, i) => {
      if (x.userId == to) {
        from_index = i;
        x.pending = "rejected";
      }
    });

    from_user.friends = array_move(from_user.friends, from_index, 0);

    let to_index;
    to_user.requests = to_user.requests.filter((x, i) => {
      return x.userId != from_user.userId;
    });

    to_user.friends = array_move(to_user.friends, to_index, 0);
    let user_from_send = await collection.findOneAndUpdate(
      { userId: from },
      from_user
    );

    let user_to_send = await collection.findOneAndUpdate(
      { userId: to },
      to_user
    );
    return from_user;
  } catch (error) {
    throw error;
  }
}

async function blockRequest(from, to) {
  try {
    let collection = await getUserCollection();
    let from_user = await collection.findOne({ userId: from });
    let to_user = await collection.findOne({ userId: to });

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
    let user_from_send = await collection.findOneAndUpdate(
      { userId: from },
      from_user
    );

    let user_to_send = await collection.findOneAndUpdate(
      { userId: to },
      to_user
    );
    return to_user;
  } catch (error) {
    throw error;
  }
}
async function unBlockRequest(from, to) {
  try {
    let collection = await getUserCollection();
    let from_user = await collection.findOne({ userId: from });
    let to_user = await collection.findOne({ userId: to });

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
    let user_from_send = await collection.findOneAndUpdate(
      { userId: from },
      from_user
    );

    let user_to_send = await collection.findOneAndUpdate(
      { userId: to },
      to_user
    );
    return to_user;
  } catch (error) {
    throw error;
  }
}

async function removeFriendRequest(from, to) {
  try {
    let collection = await getUserCollection();
    let from_user = await collection.findOne({ userId: from });
    let to_user = await collection.findOne({ userId: to });

    from_user.friends = from_user.friends.filter((x) => {
      return x.userId !== to;
    });

    to_user.friends = to_user.friends.filter((x) => {
      return x.userId !== from;
    });

    let user_from_send = await collection.findOneAndUpdate(
      { userId: from },
      from_user
    );

    let user_to_send = await collection.findOneAndUpdate(
      { userId: to },
      to_user
    );
    return to_user;
  } catch (error) {
    throw error;
  }
}

async function sendRequest(from, to) {
  try {
    let collection = await getUserCollection();
    let from_user = await collection.findOne({ userId: from });
    let to_user = await collection.findOne({ userId: to });

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
      let user_from_send = await collection.findOneAndUpdate(
        { userId: from },
        from_user
      );

      let user_to_send = await collection.findOneAndUpdate(
        { userId: to },
        to_user
      );
      return [from_user, to_user];
    } else {
      return ["request already sent", "request already sent"];
    }
  } catch (error) {
    throw error;
  }
}

async function deleteAllUsers() {
  try {
    let colleciton = await getUserCollection();
    colleciton.deleteMany({});
  } catch (error) { }
}
export {
  deleteAllUsers,
  addFriend,
  createUser,
  removeFriend,
  blockFriend,
  setPending,
  getUserData,
  findUserName,
  searchUsers,
  rejectRequest,
  acceptRequest,
  sendRequest,
  unBlockRequest,
  blockRequest,
  removeFriendRequest,
};
