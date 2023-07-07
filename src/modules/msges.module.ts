import date from "date-and-time";
import { getDb } from "../config/db.config";
import { incrementUnread } from "./user.module";
import { incrementUnRead } from "./groupchat.module";
async function addMsg(
  chatId,
  type,
  content,
  from,
  url,
  group,
  friendId,
  myChatRef,
  replyedTo,
  isReply,
  forwarded
) {
  if (url == undefined) {
    url = "";
  }
  try {
    let prisma = getDb();
    if (!group) {
      let _;
      if (isReply) {
        _ = await prisma.msges.create({
          data: {
            type: type,
            isReply: isReply,
            reptedTO: {
              connect: {
                id: replyedTo,
              },
            },
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
            reptedTO: {
              include: {
                from: true,
              },
            },
            replys: true,
            from: true,
            Chat: true,
          },
        });
      } else {
        _ = await prisma.msges.create({
          data: {
            type: type,
            isReply: isReply,
            forwarded: forwarded,
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
            reptedTO: {
              include: {
                from: true,
              },
            },
            from: true,
            Chat: true,
          },
        });
      }
      incrementUnread(friendId);
      let msg = _;

      return { msg };
    } else {
      let _;
      if (replyedTo) {
        _ = await prisma.msges.create({
          data: {
            type: type,
            reptedTO: {
              connect: {
                id: replyedTo,
              },
            },
            isReply: isReply,
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
            reptedTO: {
              include: {
                from: true,
              },
            },
            replys: true,
            from: true,
            Chat: true,
          },
        });
      } else {
        _ = await prisma.msges.create({
          data: {
            type: type,
            forwarded: forwarded,
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
            reptedTO: {
              include: {
                from: true,
              },
            },
            replys: true,
            from: true,
            Chat: true,
          },
        });
      }

      let msg = _;
      let groupChatRefs = await prisma.groupChat.findUnique({
        where: {
          id: chatId,
        },
        include: {
          groupChatRef: {
            include: {
              user: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      let y;
      groupChatRefs.groupChatRef.forEach(async (x) => {
        if (x.id !== myChatRef) {
          y = x.id;
          await incrementUnRead(x.id);
        }
      });
      return { msg, y };
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
