import { addMsg, deleteMsg, editMsg } from "../modules/msges.module";
import {
  deleteMsgGgroup,
  editMsgGgroup,
  newMsgGroup,
} from "../services/ably.service";

async function handleNewMsg(data, channel) {
  try {
    let { content, type, from, chatId, url } = data;
    console.log(content, type, from, chatId, url);

    let msg = await addMsg(chatId, type, content, from, url, false);
    let { from_channel, to_channel } = channel;
    from_channel.publish("new-msg", {
      data: msg,
    });
    to_channel.publish("new-msg", {
      data: msg,
    });
  } catch (error) {
    console.log(error);
  }
}

async function handleDeleteMsg(data, channel) {
  try {
    let { msgId: msgid, chatId } = data;
    let _ = await deleteMsg(msgid);

    let { from_channel, to_channel } = channel;
    from_channel.publish("delete-msg", {
      msgid,
      chatId,
    });
    to_channel.publish("delete-msg", {
      msgid,
      chatId,
    });
  } catch (error) {
    console.log(error);
  }
}
async function handleEditMsg(data, channel) {
  try {
    let { msgId, content, chatId } = data;
    await editMsg(content, msgId);

    let { from_channel, to_channel } = channel;
    from_channel.publish("edit-msg", {
      msgId,
      chatId,
      content,
    });
    to_channel.publish("edit-msg", {
      msgId,
      chatId,
      content,
    });
  } catch (error) {
    console.log(error);
  }
}
async function handleEditMsgGroup(data, channel) {
  try {
    let { msgId, content, chatId } = data;
    await editMsg(content, msgId);
    let { to } = channel;
    to.forEach((x) => {
      console.log(x);

      editMsgGgroup(x.user.id, content, chatId, msgId);
    });
  } catch (error) {
    throw error;
  }
}
async function handleDeleteMsgGroup(data, channel) {
  try {
    let { msgId: msgid, chatId } = data;
    let _ = await deleteMsg(msgid);

    let { to } = channel;
    to.forEach((x) => {
      deleteMsgGgroup(x.user.id, msgid, chatId);
    });
  } catch (error) {
    console.log(error);
  }
}
async function handleNewMsgGroup(data, channel) {
  try {
    let { content, type, from, chatId, url } = data;

    let msg = await addMsg(chatId, type, content, from, url, true);
    let { to } = channel;
    to.forEach((x) => {
      newMsgGroup(x.user.id, msg, chatId);
    });
  } catch (error) {
    console.log(error);
  }
}

export {
  handleNewMsg,
  handleDeleteMsg,
  handleEditMsg,
  handleEditMsgGroup,
  handleDeleteMsgGroup,
  handleNewMsgGroup,
};
