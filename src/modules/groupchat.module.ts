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
  try {
    let prisma = getDb();
    let group_ = await prisma.groupChat.update({
      where: {
        id: groupId,
      },
      data: {
        user: {
          connect: connectUsers,
        },
        msges: {
          create: {
            content: msg,
            type: "CMD",
          },
        },
      },
      include: {
        user: {
          include: {
            user: true,
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

    let group_ = await prisma.groupChat.create({
      data: {
        name: name,
        workspace: {
          connect: {
            id: workspaceId,
          },
        },
        user: {
          connect: connectUsers,
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
        user: {
          include: {
            user: true,
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
async function removeUser(msg, userId, chatId) {
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
        user: {
          disconnect: {
            id: userId,
          },
        },
      },
      include: {
        msges: true,
        user: {
          include: {
            user: true,
          },
        },
      },
    });
    let x = gruop_.msges.at(-1);
    let users = gruop_.user;
    return { x, users };
  } catch (error) {
    console.log(error);
  }
}

export { addMemebToGroup, createNewGruop, removeUser };
