import Ably from "ably";
import dotenv from "dotenv";
import {
  handleAddUnread,
  handleNewChat,
  handleRead,
} from "../controllers/users.controller";
import {
  handleDeleteMsg,
  handleDeleteMsgGroup,
  handleEditMsg,
  handleEditMsgGroup,
  handleNewMsg,
  handleNewMsgGroup,
} from "../controllers/msg.controller";
import { deleteMsg } from "../modules/msges.module";
import { setUnReadToZero } from "../modules/groupchat.module";

dotenv.config(); //to read env files

const ably_key = process.env.ABLY; //ably api key
const ably_client = new Ably.Realtime.Promise(ably_key);
async function ably_endpoints() {
  let server_channel = ably_client.channels.get("server"); // it is the main channel that every client connects to in order to make realtime cooms.
  // server_channel.subscribe("new-chat", async (data) => {
  //   try {
  //     let user1Channel = ably_client.channels.get(data.data.user1.user.id);
  //     let user2Channel = ably_client.channels.get(data.data.user2.user.id);
  //     await handleNewChat(data.data, { user1Channel, user2Channel });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("new-msg-group", async (data) => {
  //   try {
  //     let from_channel = ably_client.channels.get(data.data.from);
  //     let to = data.data.to;
  //     let _ = await handleNewMsgGroup(data.data, { from_channel, to });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("new-msg", async (data) => {
  //   try {
  //        let _ = await handleNewMsg(data.data, { from_channel, to_channel });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("unread-chat", async (data) => {
  //   try {
  //     await handleRead(data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("delete-msg", async (data) => {
  //   try {
  //     let from_channel = ably_client.channels.get(data.data.from);
  //     let to_channel = ably_client.channels.get(data.data.to);
  //     let _ = await handleDeleteMsg(data.data, { from_channel, to_channel });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("delete-msg-group", async (data) => {
  //   try {
  //     let from_channel = ably_client.channels.get(data.data.from);
  //     let to = data.data.to;
  //     let _ = await handleDeleteMsgGroup(data.data, { from_channel, to });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("edit-msg", async (data) => {
  //   try {
  //     console.log(data);
  //
  //     let from_channel = ably_client.channels.get(data.data.from);
  //     let to_channel = ably_client.channels.get(data.data.to);
  //     let _ = await handleEditMsg(data.data, { from_channel, to_channel });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("edit-msg-group", async (data) => {
  //   try {
  //     let from_channel = ably_client.channels.get(data.data.from);
  //     let to = data.data.to;
  //
  //     let _ = await handleEditMsgGroup(data.data, { from_channel, to });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
  // server_channel.subscribe("unread-group-chat", async (data) => {
  //   try {
  //     setUnReadToZero(data.data.id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });
}

async function newMemeberInWorkspce(
  userId,
  msg,
  newUser,
  chatId,
  workSpaceID,
  user
) {
  let userChannel = ably_client.channels.get(userId);
  await userChannel.publish("new-memeber-workspace", {
    msg: msg,
    newUser: newUser,
    chiatId: chatId,
    workSpaceID: workSpaceID,
    user: user,
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
async function removedFromGroup(userId, groupChatRefId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("group-remove", {
      groupChatRefId,
    });
  } catch (error) {
    console.log(error);
  }
}

async function removeMember(userId, msg, rId, groupId, groupChatRefId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("group-remove-member", {
      msg,
      rId,
      groupChatRefId: groupChatRefId,
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
