import date from "date-and-time";
import { getDb } from "../config/db.config";
async function addMsg(chatId, type, content, from, url, group) {
  if (url == undefined) {
    url = "";
  }
  try {
    let prisma = getDb();
    if (!group) {
      let _ = await prisma.msges.create({
        data: {
          type: type,
          Chat: {
            connect: { id: chatId },
          },
          content: content,
          url: url,

          from: {
            connect: {
              id: from,
            },
          },
        },
        include: {
          replys: true,
          from: true,
        },
      });

      let msg = _;

      return { msg };
    } else {
      let _ = await prisma.msges.create({
        data: {
          type: type,
          groupchat: {
            connect: { id: chatId },
          },
          content: content,
          url: url,

          from: {
            connect: {
              id: from,
            },
          },
        },
        include: {
          replys: true,
          from: true,
        },
      });

      let msg = _;

      return { msg };
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteMsg(msgid) {
  try {
    let prisma = getDb();
    let deletedmsg = await prisma.msges.delete({
      where: {
        id: msgid,
      },
    });
  } catch (error) {
    throw error;
  }
}
async function editMsg(content, msgId) {
  let prisma = getDb();
  try {
    let editedMsg = await prisma.msges.update({
      where: {
        id: msgId,
      },
      data: {
        content: content,
      },
    });
  } catch (error) {
    console.log(error, "hiii");
  }
}

export { addMsg, deleteMsg, editMsg };
