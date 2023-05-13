import { getMsgCollection } from "../config/db.config";

async function addMsg(msg, chatId) {
  try {
    let collection = await getMsgCollection();
    let msges;

    try {
      msges = await collection.findOne({ chatId: chatId });
      if (msges == null) {
        try {
          msges = await collection.create({ chatId: chatId });
          msges.msges = [msg];
        } catch (error) {
          throw error;
        }
      } else {
        if (msges.msges) {
          msges.msges.push(msg);
        } else {
          msges.msges = [msg];
        }
      }
      try {
        await collection.updateOne({ chatId: chatId }, msges);
        return msges;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteMsg(chatId, msgId) {
  try {
    let collection = await getMsgCollection();

    try {
      let msges = await collection.findOne({ chatId: chatId });
      try {
        msges.msges = msges.msges.filter((x) => {
          return x.msgId != msgId;
        });

        await collection.updateOne({ chatId: chatId }, msges);
        return msges;
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function editMsg(chatId, msgId, msg) {
  try {
    let collection = await getMsgCollection();

    try {
      let msges = await collection.findOne({ chatId: chatId });
      try {
        msges.msges.forEach((x) => {
          if (x.msgId == msgId) {
            x.msg = msg;
          }
        });

        await collection.updateOne({ chatId: chatId }, msges);
      } catch (error) {
        throw error;
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function getAllMsges(chatId) {
  try {
    let collection = await getMsgCollection();
    try {
      let msges = await collection.findOne({ chatId: chatId });

      return msges;
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

async function deleteAllMsg(chatId) {
  try {
    let collection = await getMsgCollection();

    try {
      let msges = await collection.findOneAndDelete({ chatId: chatId });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
}

export { addMsg, deleteMsg, editMsg, getAllMsges };
