import { getMsgCollection } from "../config/db.config";

import date from "date-and-time";

async function addMsg(msg, chatId) {
  try {
    let collection = await getMsgCollection();
    let msges;

    msges = await collection.findOne({ chatId: chatId });
    if (msges == null) {
      msges = await collection.create({ chatId: chatId });
      msges.msges = [msg];
    } else {
      if (msges.msges) {
        msges.msges.push(msg);
      } else {
        msges.msges = [msg];
      }
    }

    await collection.updateOne({ chatId: chatId }, msges);
    return msges;
  } catch (error) {
    throw error;
  }
}

async function deleteMsg(chatId, msgId) {
  try {
    let collection = await getMsgCollection();

    let msges = await collection.findOne({ chatId: chatId });
    msges.msges = msges.msges.filter((x) => {
      return x.msgId != msgId;
    });

    await collection.updateOne({ chatId: chatId }, msges);
    return msges;
  } catch (error) {
    throw error;
  }
}

async function editMsg(chatId, msgId, msg) {
  try {
    let collection = await getMsgCollection();

    let msges = await collection.findOne({ chatId: chatId });

    let now = new Date();
    let date_ = date.format(now, "YYYY/MM/DD HH:mm:ss");

    msges.msges.forEach((x) => {
      if (x.msgId == msgId) {
        x.msg = msg;
        x.edited = true;
        x.date = date_;
      }
    });

    await collection.updateOne({ chatId: chatId }, msges);
    return msges;
  } catch (error) {
    throw error;
  }
}

async function getAllMsges(chatId) {
  try {
    let collection = await getMsgCollection();

    let msges = await collection.findOne({ chatId: chatId });

    return msges;
  } catch (error) {
    throw error;
  }
}

async function deleteAllMsg(chatId) {
  //to drop db after tests
  try {
    let collection = await getMsgCollection();

    let msges = await collection.findOneAndDelete({ chatId: chatId });
  } catch (error) {
    throw error;
  }
}

export { addMsg, deleteMsg, editMsg, getAllMsges };
