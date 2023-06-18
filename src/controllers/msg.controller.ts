import { addMsg, deleteMsg, editMsg } from "../modules/msges.module";
import {
  deleteMsgGgroup,
  editMsgGgroup,
  newMsgGroup,
} from "../services/ably.service";
import Ably from "ably";
const ably_key = process.env.ABLY; //ably api key

const ably_client = new Ably.Realtime.Promise(ably_key);

async function handleNewMsg(req, res, next) {
  try {
    let data = req.body;
    let { content, type, from, chatId, url, friendId, myChatRef } = data;
    let from_channel = ably_client.channels.get(data.from);
    let to_channel = ably_client.channels.get(data.to);

    let msg = await addMsg(
      chatId,
      type,
      content,
      from,
      url,
      false,
      friendId,
      myChatRef
    );

    from_channel.publish("new-msg", {
      data: { msg },
    });
    to_channel.publish("new-msg", {
      data: { msg, friendId },
    });
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}

async function handleDeleteMsg(req, res, next) {
  try {
    let data = req.body;
    let from_channel = ably_client.channels.get(data.from);
    let to_channel = ably_client.channels.get(data.to);
    let { msgId: msgid, chatId } = data;
    let _ = await deleteMsg(msgid);
    from_channel.publish("delete-msg", {
      msgid,
      chatId,
    });
    to_channel.publish("delete-msg", {
      msgid,
      chatId,
    });
    res.send("ok");
  } catch (error) {
    next(error);
  }
}
async function handleEditMsg(req, res, next) {
  try {
    let data = req.body;
    let from_channel = ably_client.channels.get(data.from);
    let to_channel = ably_client.channels.get(data.to);

    let { msgId, content, chatId } = data;
    await editMsg(content, msgId);

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
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}
async function handleEditMsgGroup(req, res, next) {
  try {
    let data = req.body;
    let { msgId, content, chatId } = data;
    let to = data.to;
    await editMsg(content, msgId);

    to.forEach((x) => {
      console.log(x);

      editMsgGgroup(x, content, chatId, msgId);
    });
    res.send("ok");
  } catch (error) {
    next(error);
  }
}
async function handleDeleteMsgGroup(req, res, next) {
  try {
    let data = req.body;
    let to = data.to;
    let { msgId: msgid, chatId } = data;
    let _ = await deleteMsg(msgid);
    to.forEach((x) => {
      deleteMsgGgroup(x, msgid, chatId);
    });
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}
async function handleNewMsgGroup(req, res, next) {
  try {
    let data = req.body;
    let { content, type, from, chatId, url, myChatRef } = data;
    console.log(myChatRef);

    let msg = await addMsg(
      chatId,
      type,
      content,
      from,
      url,
      true,
      null,
      myChatRef
    );
    let to = data.to;

    to.forEach((x) => {
      newMsgGroup(x, msg, chatId);
    });
    res.send("ok");
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
