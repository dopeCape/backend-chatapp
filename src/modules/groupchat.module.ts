import { getDb } from "../config/db.config";

async function addMemebToGroup(users, workspaceId, groupId, name) {
  const connectUsers = users.map((user) => ({
    id: user.id,
  }));

  let msg = `${name} added `;
  if (users.length == 1) {
    msg = msg + ` ${users[0].user.name}`;
  } else {
    users.forEach((x) => {
      msg = msg + ` ${x.user.name} `;
    });
  }
  try {
    let groupChatRefIds = [];
    let groupChatRefs = [];

    let prisma = getDb();

    await Promise.all(
      connectUsers.map(async (x) => {
        let refs = await prisma.groupChatRef.create({
          data: {
            user: {
              connect: {
                id: x.id,
              },
            },
          },
        });

        groupChatRefIds.push(refs.id);
      })
    );
    let group_;

    await Promise.all(
      groupChatRefIds.map(async (x, i) => {
        if (i == 0) {
          let group = await prisma.groupChat.update({
            where: {
              id: groupId,
            },
            data: {
              groupChatRef: {
                connect: {
                  id: x,
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
          group_ = group;
        } else {
          let group = await prisma.groupChat.update({
            where: {
              id: groupId,
            },
            data: {
              groupChatRef: {
                connect: {
                  id: x,
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
          group_ = group;
        }
      })
    );

    await Promise.all(
      groupChatRefIds.map(async (x) => {
        let refs = await prisma.groupChatRef.findUnique({
          where: {
            id: x,
          },
          include: {
            groupChat: {
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
                    from: true,
                    replys: true,
                  },
                },
              },
            },
            user: {
              include: { user: true },
            },
          },
        });
        groupChatRefs.push(refs);
      })
    );
    return { groupChatRefs, group_ };
  } catch (error) {
    console.log(error);
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
    let chatRefIds = [];
    let chatRefs = [];

    await Promise.all(
      connectUsers.map(async (x) => {
        let chatRef = await prisma.groupChatRef.create({
          data: {
            user: {
              connect: {
                id: x.id,
              },
            },
            groupChat: {
              connect: {
                id: group_.id,
              },
            },
          },
        });

        chatRefIds.push(chatRef.id);
      })
    );

    await Promise.all(
      chatRefIds.map(async (x) => {
        let chatRef = await prisma.groupChatRef.findUnique({
          where: {
            id: x,
          },
          include: {
            groupChat: {
              include: {
                msges: {
                  include: {
                    replys: true,
                    from: true,
                  },
                },
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
            },

            user: {
              include: {
                user: true,
              },
            },
          },
        });

        chatRefs.push(chatRef);
      })
    );
    return chatRefs;
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
          disconnect: {
            id: groupChatRefId,
          },
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
    await prisma.groupChatRef.delete({
      where: {
        id: groupChatRefId,
      },
    });
    let x = gruop_.msges.at(-1);
    let users = gruop_.groupChatRef;
    return { x, users };
  } catch (error) {
    console.log(error);
  }
}
async function incrementUnRead(chatRefId) {
  let prisma = getDb();
  try {
    await prisma.groupChatRef.update({
      where: {
        id: chatRefId,
      },
      data: {
        unRead: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
async function setUnReadToZero(chatRefId) {
  let prisma = getDb();
  try {
    await prisma.groupChatRef.update({
      where: {
        id: chatRefId,
      },
      data: {
        unRead: 0,
      },
    });
  } catch (error) {
    throw error;
  }
}

export {
  addMemebToGroup,
  createNewGruop,
  removeUser,
  setUnReadToZero,
  incrementUnRead,
};
