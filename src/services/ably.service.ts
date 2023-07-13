import Ably from "ably";
import { log } from "console";
import dotenv from "dotenv";

dotenv.config(); //to read env files

const ably_key = process.env.ABLY; //ably api key
const ably_client = new Ably.Realtime.Promise(ably_key);
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
async function newMemberInGroup(
  userId,
  chatId,
  msg,
  newUser,
  history,
  historyId
) {
  try {
    let userChannel = ably_client.channels.get(userId);
    await userChannel.publish("new-memeber-group", {
      chatId,
      msg,
      newUser,
      history,
      historyId,
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

async function removeMember(
  userId,
  msg,
  rId,
  groupId,
  groupChatRefId,
  history,
  historyId
) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("group-remove-member", {
      msg,
      rId,
      groupChatRefId: groupChatRefId,
      groupId,
      history,
      historyId,
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
async function updateWorkspace(userId, workSpaceId, workspace) {
  try {
    let userChannel = ably_client.channels.get(userId);
    console.log(userId);
    userChannel.publish("workspace-update", {
      workSpaceId,
      workspace,
    });
  } catch (error) {
    console.log(error);
  }
}
async function delelteGroupSender(userId, groupChatId, history, historyId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("group-delete", {
      groupChatId,
      history,
      historyId,
    });
  } catch (error) {
    console.log(error);
  }
}
async function removeMemberFromWorkspace(
  userId,
  id,
  friendId,
  groupChats,
  workspaceId
) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("workspace-remove", {
      id,
      friendId,
      workspaceId,
      groupChats,
    });
  } catch (error) {
    console.log(error);
  }
}
async function deleteWorkspace(userId, workspaceId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("workspace-delete", {
      userId,
      workspaceId,
    });
  } catch (error) {
    console.log(error);
  }
}
async function unfriendSender(userId, chatWorkspaceId, workspaceId) {
  try {
    let userChannel = ably_client.channels.get(userId);
    userChannel.publish("unfriend", {
      userId,
      chatWorkspaceId,
      workspaceId,
    });
  } catch (error) {
    console.log(error);
  }
}
export {
  newMemeberInWorkspce,
  newMemeberAdder,
  newGroupChat,
  newMemberInGroup,
  removeMember,
  removedFromGroup,
  deleteMsgGgroup,
  editMsgGgroup,
  newMsgGroup,
  updateWorkspace,
  delelteGroupSender,
  removeMemberFromWorkspace,
  deleteWorkspace,
  unfriendSender,
};
