import Ably from "ably";
import dotenv from "dotenv";
import { handleNewChat } from "../controllers/users.controller";
import {
  handleDeleteMsg,
  handleDeleteMsgGroup,
  handleEditMsg,
  handleEditMsgGroup,
  handleNewMsg,
  handleNewMsgGroup,
} from "../controllers/msg.controller";
import { deleteMsg } from "../modules/msges.module";

dotenv.config(); //to read env files

const ably_key = process.env.ABLY; //ably api key
const ably_client = new Ably.Realtime.Promise(ably_key);
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

async function ably_endpoints() {
  let server_channel = ably_client.channels.get("server"); // it is the main channel that every client connects to in order to make realtime cooms.
  server_channel.subscribe("new-chat", async (data) => {
    try {
      let user1Channel = ably_client.channels.get(data.data.user1.user.id);

      let user2Channel = ably_client.channels.get(data.data.user2.user.id);

      await handleNewChat(data.data, { user1Channel, user2Channel });
    } catch (error) {
      console.log(error);
    }
  });
  server_channel.subscribe("new-msg-group", async (data) => {
    try {
      let from_channel = ably_client.channels.get(data.data.from);
      let to = data.data.to;
      let _ = await handleNewMsgGroup(data.data, { from_channel, to });
    } catch (error) {
      console.log(error);
    }
  });
  server_channel.subscribe("new-msg", async (data) => {
    try {
      let from_channel = ably_client.channels.get(data.data.from);
      let to_channel = ably_client.channels.get(data.data.to);
      let _ = await handleNewMsg(data.data, { from_channel, to_channel });
    } catch (error) {
      console.log(error);
    }
  });
  server_channel.subscribe("delete-msg", async (data) => {
    try {
      let from_channel = ably_client.channels.get(data.data.from);
      let to_channel = ably_client.channels.get(data.data.to);
      let _ = await handleDeleteMsg(data.data, { from_channel, to_channel });
    } catch (error) {
      console.log(error);
    }
  });
  server_channel.subscribe("delete-msg-group", async (data) => {
    try {
      let from_channel = ably_client.channels.get(data.data.from);
      let to = data.data.to;
      let _ = await handleDeleteMsgGroup(data.data, { from_channel, to });
    } catch (error) {
      console.log(error);
    }
  });
  server_channel.subscribe("edit-msg", async (data) => {
    try {
      console.log(data);

      let from_channel = ably_client.channels.get(data.data.from);
      let to_channel = ably_client.channels.get(data.data.to);
      let _ = await handleEditMsg(data.data, { from_channel, to_channel });
    } catch (error) {
      console.log(error);
    }
  });
  server_channel.subscribe("edit-msg-group", async (data) => {
    try {
      let from_channel = ably_client.channels.get(data.data.from);
      let to = data.data.to;

      let _ = await handleEditMsgGroup(data.data, { from_channel, to });
    } catch (error) {
      console.log(error);
    }
  });
}

async function newMemeberInWorkspce(userId, msg, newUser, chatId, workSpaceID) {
  let userChannel = ably_client.channels.get(userId);
  await userChannel.publish("new-memeber-workspace", {
    msg: msg,
    newUser: newUser,
    chiatId: chatId,
    workSpaceID: workSpaceID,
  });
  console.log("sent");
}
async function newMemberInGroup(userId, chatId, msg, newUser) {
  try {
    let userChannel = ably_client.channels.get(userId);
    await userChannel.publish("new-memeber-group", {
      chatId,
      msg,
      newUser,
    });
  } catch (error) {
    console.log(error);
  }
}
async function newGroupChat(userId, GroupChat) {
  try {
    let userChannel = ably_client.channels.get(userId);
    await userChannel.publish("new-group", {
      GroupChat,
    });
  } catch (error) {
    console.log(error);
  }
}
async function newMemeberAdder(userId, workspace, GroupChat) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("new-workspace", {
      workspace,
      GroupChat,
    });

    console.log("sent");
  } catch (error) {
    console.log(error);
  }
}
async function removedFromGroup(userId, groupId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("group-remove", {
      groupId,
    });
  } catch (error) {
    console.log(error);
  }
}

async function removeMember(userId, msg, rId, groupId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("group-remove-member", {
      msg,
      rId,
      groupId,
    });
  } catch (error) {
    console.log(error);
  }
}
async function newMsgGroup(userId, msg, chatId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("new-msg-group", {
      msg,
      chatId,
    });
  } catch (error) {
    console.log(error);
  }
}
async function editMsgGgroup(userId, msg, chatId, msgId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("edit-msg-group", {
      msg,
      chatId,
      msgId,
    });
  } catch (error) {
    console.log(error);
  }
}
async function deleteMsgGgroup(userId, msgId, chatId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("delete-msg-group", {
      msgId,
      chatId,
    });
  } catch (error) {
    console.log(error);
  }
}
// export { ably_client, ably_endpoints };
export {
  newMemeberInWorkspce,
  newMemeberAdder,
  ably_endpoints,
  newGroupChat,
  newMemberInGroup,
  removeMember,
  removedFromGroup,
  deleteMsgGgroup,
  editMsgGgroup,
  newMsgGroup,
};
