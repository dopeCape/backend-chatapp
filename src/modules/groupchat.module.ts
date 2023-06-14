import { getDb } from "../config/db.config";

async function addMemebToGroup(users, workspaceId, groupId, name) {
  const connectUsers = users.map((user) => ({
    id: user.id,
  }));
  let msg = `${name} added `;
  if (users.length > 1) {
    msg = msg + ` ${users[0].user.name}`;
  } else {
    users.forEach((x) => {
      msg = msg + ` ${x.user.name} `;
    });
  }
  let groupChatRefIds = [];

  try {
    let prisma = getDb();
    connectUsers.forEach(async (x) => {
      await prisma.groupChatRef.create({
        data: {
          user: {
            connect: {
              id: x,
            },
          },
        },
      });
    });

    let group_ = await prisma.groupChat.update({
      where: {
        id: groupId,
      },
      data: {
        groupChatRef: {
          connect: {
            id: connectUsers,
          },
        },

        msges: {
          create: {
            content: msg,
            type: "CMD",
          },
        },
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
        msges: {
          include: {
            replys: true,
            from: true,
          },
        },
      },
    });
    return group_;
  } catch (error) {
    throw error;
  }
}
async function createNewGruop(workspaceId, users, user, name) {
  try {
    let prisma = getDb();
    let msg;
    if (users.length > 1) {
      msg = `${user.name} added :`;
    } else {
      msg = `${user.name} joined ${name} `;
    }

    const connectUsers = users.map((user) => ({
      id: user.id,
    }));

    users.forEach((x) => {
      if (x.user.id != user.id) {
        msg = msg + ` ${x.user.name}`;
      }
    });
    const connectRef = [];

    let group_ = await prisma.groupChat.create({
      data: {
        name: name,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },

        admin: {
          connect: {
            id: user.id,
          },
        },
        msges: {
          create: [
            {
              content: `${user.name} created ${name}`,
              type: "CMD",
            },
            {
              content: msg,
              type: "CMD",
            },
          ],
        },
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
        msges: {
          include: {
            replys: true,
            from: true,
          },
        },
      },
    });
    connectUsers.forEach(async (x) => {
      let chatRef = await prisma.groupChatRef.create({
        data: {
          user: {
            connect: {
              id: x,
            },
          },
          groupChat: {
            connect: {
              id: group_.id,
            },
          },
        },
      });
      connectRef.push(chatRef.id);
    });
    return group_;
  } catch (error) {
    throw error;
  }
}
async function removeUser(msg, userId, chatId, groupChatRefId) {
  try {
    let prisma = getDb();

    let gruop_ = await prisma.groupChat.update({
      where: {
        id: chatId,
      },
      data: {
        msges: {
          create: {
            type: "CMD",
            content: msg,
          },
        },
        groupChatRef: {
          disconnect: groupChatRefId,
        },
      },
      include: {
        msges: true,
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
    let x = gruop_.msges.at(-1);
    let users = gruop_.groupChatRef;
    return { x, users };
  } catch (error) {
    console.log(error);
  }
}

export { addMemebToGroup, createNewGruop, removeUser };
