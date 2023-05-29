import date from "date-and-time";
import { addMsg, deleteMsg, getAllMsges } from "../modules/msges.module";
import { v4 } from "uuid";
async function handleNewMsg(data, channel, from_channel) {
  let { msg, from, to, chatId } = data;
  let now = new Date();
  let date_ = date.format(now, "YYYY/MM/DD HH:mm:ss");

  let msge = {
    msgId: v4(),
    msg: msg,
    from: from,
    to: to,
    date: date_,
  };

  try {
    let msg = await addMsg(msge, chatId);
    console.log(msg);

    channel.publish("new-msg", msg);
    from_channel.publish("new-msg", msg);
  } catch (error) {
    throw error;
  }
}

async function handleGetAllMsg(req, res, next) {
  let { id } = req.params;

  let chatId = id;

  try {
    let msges = await getAllMsges(chatId);
    if (msges == null) {
      res.json({ msges: { msges: [] } });

      res.status(201);
    } else {
      res.json({ msges });
      res.status(201);
    }
  } catch (error) {
    throw error;
  }
}

async function handleDeleteMsg(data, channel) {
  let { msgId, chatId } = data;
  try {
    let msg = await deleteMsg(chatId, msgId);
    channel.publish("delete-msg", msg);
  } catch (error) {
    console.log(error);
  }
}
async function handleEditMsg(data, channel) {
  let { msgId, chatId } = data;
  try {
    let msg = await deleteMsg(chatId, msgId);
    channel.publish("edit-msg", msg);
  } catch (error) {
    console.log(error);
  }
}

export { handleNewMsg, handleGetAllMsg, handleDeleteMsg, handleEditMsg };
