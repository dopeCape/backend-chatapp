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
              admin: true,
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
                admin: true,
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
              include: {
                user: true,

                History: true,
              },
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
async function createNewGruop(
  workspaceId,
  users,
  user,
  name,
  type,
  visibility
) {
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
        type: type,
        visibility: visibility,
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
        admin: true,
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
                admin: true,
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
async function delteGroup(groupChatId, groupChatRefs) {
  try {
    let prisma = getDb();
    await prisma.groupChatRef.deleteMany({
      where: {
        id: {
          in: groupChatRefs,
        },
      },
    });
    await prisma.groupChat.delete({
      where: {
        id: groupChatId,
      },
    });
  } catch (error) {
    throw error;
  }
}
async function setMute(groupChatRefid, mute) {
  try {
    let prisma = getDb();
    await prisma.groupChatRef.update({
      where: {
        id: groupChatRefid,
      },
      data: {
        muted: mute,
      },
    });
  } catch (error) {
    throw error;
  }
}

async function removeAdminFromGroup(userId, groupId) {
  try {
    let prisma = getDb();
    let usersInAGroup = await prisma.groupChat.findFirst({
      where: {
        id: groupId,
      },
      include: {
        admin: true,
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
    if (usersInAGroup.groupChatRef.length > 0) {
      await prisma.groupChat.update({
        where: { id: groupId },
        data: {
          admin: {
            connect: { id: usersInAGroup.groupChatRef[0].user.user.id },
          },
        },
      });
      return usersInAGroup.groupChatRef[0].user.user;
    } else {
      await prisma.groupChat.delete({
        where: {
          id: groupId,
        },
      });
    }
  } catch (error) {
    throw error;
  }
}
async function delteFromAllGroup(userId, workspaceId) {
  try {
    let prisma = getDb();
    let groupChatRefs_ = await prisma.groupChatRef.findMany({
      where: {
        chatWorkSpaceId: userId,
        groupChat: {
          workspaceId: workspaceId,
        },
      },
      include: {
        user: {
          include: {
            user: true,
          },
        },
        groupChat: {
          include: {
            admin: true,
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
      },
    });
    let groupChatMapedToUserIds = [];

    await Promise.all(
      groupChatRefs_.map(async (gr) => {
        let groupChatId = gr.groupChat.id;
        let users = gr.groupChat.groupChatRef.map((x) => x.user.id);

        let { x } = await removeUser(
          `${gr.user.user.name} left ${gr.groupChat.name}`,
          userId,
          gr.groupChatId,
          gr.id
        );
        let groupChatMap = {
          users: users,
          groupChatId,
          admin: null,
          groupChatRefId: gr.id,
          msg: x,
        };

        if (gr.groupChat.admin.chatWorkSpaceId === userId) {
          let admin = await removeAdminFromGroup(userId, gr.groupChatId);
          groupChatMap.admin = admin;
        }

        console.log(groupChatMap, "workspace module");
        groupChatMapedToUserIds.push(groupChatMap);
      })
    );
    return groupChatMapedToUserIds;
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
  delteGroup,
  setMute,
  removeAdminFromGroup,
  delteFromAllGroup,
};
