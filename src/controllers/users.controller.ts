import { ablyTokenCreater } from "../config/ably.confij";
import { getAllMsges } from "../modules/msges.module";
import {
  acceptRequest,
  blockRequest,
  createUser,
  deleteAllUsers,
  findUserName,
  getUserData,
  rejectRequest,
  removeFriendRequest,
  searchUsers,
  sendRequest,
  unBlockRequest,
} from "../modules/user.module";

// async function getAllChat(user_data) {
//   return new Promise(function(resolve) {
//
//     console.log(msg);
//     resolve(msg);
//   });
// }
async function handleGetUserData(req, res, next) {
  let userId = req.params.userId;
  try {
    let msges;
    let user_data = await getUserData(userId);
    let ably_token = await ablyTokenCreater(userId);
    let msg = [];
    await Promise.all(
      user_data.friends.map(async (x) => {
        let msg_ = await getAllMsges(x.chatId);

        if (msg_ !== null) {
          msg.push(msg_);
        }
      })
    );

    res.json({ user_data, ably_token, msg });
    res.status(201);
  } catch (error) {
    next(error);
  }
}
async function handleGauth(req, res, next) {
  let { userId, userName, profilePic, email } = req.body;

  try {
    let user = await getUserData(userId);

    if (user != null) {
      res.json({ user_data: user });
      res.status(201);
    } else {
      try {
        let user_ = { userId, userName, profilePic, email };
        let user = await createUser(user_);
        res.json({ user_data: user });
        res.status(201);
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    next(error);
  }
}
async function handleSearchUser(req, res, next) {
  let { q: query } = req.params;

  try {
    let users_ = await searchUsers(query);

    res.status(200);
    res.json({
      users: users_,
    });
  } catch (error) {
    next(error);
  }
}
async function handleChelckUserName(req, res, next) {
  let userName = req.body.userName;

  try {
    let user = await findUserName(userName);
    res.json({ userName: user?.userName });
    res.status(201);
  } catch (error) {
    next(error);
  }
}

async function handleSetUserData(req, res, next) {
  let { userId, userName, profilePic, email } = req.body;
  let user = {
    userId,
    userName,
    profilePic,
    email,
  };
  try {
    let new_user = await createUser(user);
    res.json({ user_data: new_user });
    res.status(201);
  } catch (error) {
    next(error);
  }
}

async function handleSendRequest(data, channel) {
  let [from, to] = data;
  try {
    let [_, user] = await sendRequest(from, to);
    if (user == "request already sent") {
    } else {
      channel.publish("send-request", user);
    }
  } catch (error) {
    throw error;
  }
}

async function handleDelteAllUsers(req, res) {
  try {
    await deleteAllUsers();
    res.send("delted all users");
  } catch (error) {}
}

async function handleAcceptRequest(data, channel) {
  let [from, to, chatId] = data;
  try {
    let [from_user] = await acceptRequest(from, to, chatId);
    channel.publish("accept-request", { from_user, chatId });
  } catch (error) {
    throw error;
  }
}
async function handleRejectRequest(data, channel) {
  let [from, to] = data;
  try {
    let from_user = await rejectRequest(from, to);

    channel.publish("reject-request", { from_user, to });
  } catch (error) {
    throw error;
  }
}

async function handleBlockUser(data, channel) {
  let [from, to] = data;
  try {
    let to_user = await blockRequest(from, to);
    channel.publish("block-request", { to_user, from });
  } catch (error) {
    throw error;
  }
}
async function handleUnBlockUser(data, channel) {
  let [from, to] = data;
  try {
    let to_user = await unBlockRequest(from, to);

    channel.publish("unblock-request", { to_user, from });
  } catch (error) {
    throw error;
  }
}
async function handleRemoveFriend(data, channel) {
  let [from, to] = data;
  try {
    let to_user = await removeFriendRequest(from, to);

    channel.publish("unblock-request", to_user);
  } catch (error) {
    throw error;
  }
}

async function handleUserTyping(data, channel) {
  let [from, to, chatId] = data;

  try {
    channel.publish("user-typing", { from, chatId });
  } catch (error) {}
}
async function handleUserNotTyping(data, channel) {
  let [from, to, chatId] = data;

  try {
    channel.publish("user-typing", { from, chatId });
  } catch (error) {}
}

export {
  handleGetUserData,
  handleSetUserData,
  handleChelckUserName,
  handleGauth,
  handleSearchUser,
  handleSendRequest,
  handleAcceptRequest,
  handleDelteAllUsers,
  handleRemoveFriend,
  handleRejectRequest,
  handleBlockUser,
  handleUnBlockUser,
  handleUserTyping,
  handleUserNotTyping,
};
