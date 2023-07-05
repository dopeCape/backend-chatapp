import { Role, User, Workspace, chatWorkSpace, type } from "@prisma/client";
import { getDb } from "../config/db.config";
import { v4 } from "uuid";
import { addUserToWorkSpace } from "./workspace.module";
import { newMemeberInWorkspce } from "../services/ably.service";
async function getInvite(email) {
  let prisma = getDb();
  try {
    let request = await prisma.invites.findFirst({
      where: {
        email: email,
      },
      include: {
        workspace: true,
      },
    });
    return request;
  } catch (error) {
    throw error;
  }
}
async function createInvite(email: string, role: Role, workspaceId) {
  let prisma = getDb();
  let invite = await getInvite(email);
  console.log(email, workspaceId, role);

  try {
    if (invite === null) {
      prisma.invites.create({
        data: {
          email: email,
          role: role,
          workspace: {
            connect: workspaceId,
          },
        },
        include: {
          workspace: true,
        },
      });
      return "invite send";
    } else {
      return "already invited ";
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function deleteRequest() { }
async function createUser(user, workspaceId?, groupChatId?) {
  try {
    let prisma = getDb();

    let created_user = await prisma.user.create({
      data: {
        name: user.name,
        fireBaseid: user.fireBaseid,
        email: user.email,
        admin: user.admin,
        profilePic: user.profilePic,
        chatWorkSpaces: {
          create: { role: user.role_ },
        },
      },
      include: {
        chatWorkSpaces: {
          include: {
            user: true,
            workspaces: {
              include: {
                History: {
                  include: {
                    entrys: true,
                  },
                },
              },
            },
            Friend: {
              include: {
                friend: {
                  include: {
                    user: {
                      include: {
                        chatWorkSpaces: {
                          include: {
                            Friend: {
                              include: {
                                workspace: true,
                              },
                              where: {
                                friend: {
                                  user: {
                                    fireBaseid: user.fireBaseid,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                chat: {
                  include: {
                    msges: {
                      include: {
                        replys: true,
                      },
                    },
                  },
                },
              },
            },

            groupChatRef: {
              include: {
                groupChat: {
                  include: {
                    msges: {
                      include: {
                        replys: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
    let msg = null;
    if (workspaceId != null) {
      let { msg_, workspace_, groupChatId, groupChatRef_ } =
        await addUserToWorkSpace(
          created_user.chatWorkSpaceId,
          created_user.name,
          created_user.email,
          "email"
        );
      let created_user_ = await prisma.user.findFirst({
        where: {
          fireBaseid: user.fireBaseid,
        },
        include: {
          chatWorkSpaces: {
            include: {
              user: true,

              workspaces: true,

              Friend: {
                include: {
                  friend: {
                    include: {
                      user: true,
                    },
                  },
                  chat: {
                    include: {
                      msges: {
                        include: {
                          replys: true,
                        },
                      },
                    },
                  },
                },
              },
              groupChatRef: {
                include: {
                  groupChat: {
                    include: {
                      msges: {
                        include: {
                          replys: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      let user_ = await prisma.chatWorkSpace.findFirst({
        where: { id: created_user_.chatWorkSpaceId },
        include: { user: true },
      });

      return {
        created_user_,
        workspace_,
        msg_,
        user_,
        groupChatId,
        groupChatRef_,
      };
    }
    return { created_user };

    // _=await newMemeberInWorkspce()
  } catch (error) {
    console.log(error);
  }
}

async function sendEmailInvite(email, workspaceId, role) {
  let prisma = getDb();
  console.log(email, workspaceId, role);
  try {
    let user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (role == "member") {
      role = Role.MEMBER;
    } else {
      role = Role.EXTERNAL;
    }
    if (user == null) {
      let invite = await prisma.invites.findFirst({
        where: {
          email: email,
        },
        include: {
          workspace: true,
        },
      });
      if (invite == null) {
        let inveite_ = await prisma.invites.create({
          data: {
            email: email,
            workspace: {
              connect: {
                id: workspaceId,
              },
            },
            role: role,
          },
        });
        return "invite send";
      } else {
        let x = true;
        invite.workspace.forEach((y) => {
          if (y.id === workspaceId) {
            x = false;
          }
        });

        if (x) {
          let invite_ = await prisma.invites.update({
            where: {
              email: email,
            },
            data: {
              workspace: {
                connect: {
                  id: workspaceId,
                },
              },
            },
          });
          return "invite send";
        } else {
          return "already invited to the workspace";
        }
      }
    } else {
      return `user alreay exists:${user.name}`;
    }
  } catch (error) {
    throw error;
  }
}

async function searchUser(name) {
  let prisma = getDb();
  try {
    let users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
          mode: "insensitive", // Case-insensitive search
        },
      },
      include: {
        chatWorkSpaces: true,
      },
    });
    console.log(users);

    return users;
  } catch (error) {
    throw error;
  }
}

async function getUserData(fireBaseid) {
  console.log(fireBaseid);

  try {
    let prisma = getDb();

    let user_ = await prisma.user.findUnique({
      where: {
        fireBaseid: fireBaseid,
      },
      include: {
        chatWorkSpaces: {
          include: {
            History: {
              include: {
                entrys: true,
              },
            },

            user: true,
            workspaces: {
              include: {
                chatWorkSpace: {
                  include: {
                    user: true,
                  },
                },
              },
            },
            Friend: {
              include: {
                friend: {
                  include: {
                    user: {
                      include: {
                        chatWorkSpaces: {
                          include: {
                            Friend: {
                              include: {
                                workspace: true,
                              },
                              where: {
                                friend: {
                                  user: {
                                    fireBaseid: fireBaseid,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },

                chat: {
                  include: {
                    msges: {
                      include: {
                        from: true,
                        replys: true,
                        reptedTO: {
                          include: {
                            from: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },

            groupChatRef: {
              include: {
                groupChat: {
                  include: {
                    admin: true,
                    msges: {
                      include: {
                        reptedTO: {
                          include: {
                            from: true,
                          },
                        },
                        from: true,
                        replys: true,
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
              },
            },
          },
        },
      },
    });
    return user_;
  } catch (error) {
    throw error;
  }
}
async function makeUserAFriend(
  user1,
  user2,
  workspace: string,
  content: string,
  type: type,
  url: string
) {
  let prisma = getDb();
  if (url == undefined) {
    url = "";
  }
  const chatId = v4();
  try {
    let user1_ = await prisma.chatWorkSpace.update({
      where: {
        id: user1.id,
      },
      data: {
        Friend: {
          create: {
            workspace: {
              connect: {
                id: workspace,
              },
            },
            chat: {
              create: {
                id: chatId,
                workspace: {
                  connect: {
                    id: workspace,
                  },
                },
                msges: {
                  create: [
                    {
                      type: "CMD",
                      content: "Start of the converstion",
                    },
                    {
                      content: content,
                      type: type,

                      url: url,
                      from: {
                        connect: {
                          id: user1.user.id,
                        },
                      },
                    },
                  ],
                },
              },
            },
            friend: {
              connect: {
                id: user2.id,
              },
            },
          },
        },
      },
    });
    let user1_msg = await prisma.chatWorkSpace.findUnique({
      where: {
        id: user1.id,
      },
      include: {
        user: true,
        workspaces: {
          include: {
            chatWorkSpace: {
              include: {
                user: true,
              },
            },
          },
        },
        Friend: {
          include: {
            friend: {
              include: {
                user: {
                  include: {
                    chatWorkSpaces: {
                      include: {
                        Friend: {
                          where: {
                            friend: {
                              id: user1.id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },

            chat: {
              include: {
                msges: {
                  include: {
                    from: true,
                    replys: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    let user2_ = await prisma.chatWorkSpace.update({
      where: {
        id: user2.id,
      },
      data: {
        Friend: {
          create: {
            workspace: {
              connect: {
                id: workspace,
              },
            },

            chat: { connect: { id: chatId } },
            friend: { connect: { id: user1_.id } },
          },
        },
      },
    });
    let user2_msg = await prisma.chatWorkSpace.findUnique({
      where: {
        id: user2.id,
      },
      include: {
        user: true,
        workspaces: {
          include: {
            chatWorkSpace: {
              include: {
                user: true,
              },
            },
          },
        },
        Friend: {
          include: {
            friend: {
              include: {
                user: {
                  include: {
                    chatWorkSpaces: {
                      include: {
                        Friend: {
                          where: {
                            workspace: {
                              id: workspace,
                            },
                            friend: {
                              id: user2.id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },

            chat: {
              include: {
                msges: {
                  include: {
                    from: true,
                    replys: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    user1_msg = await prisma.chatWorkSpace.findUnique({
      where: {
        id: user1.id,
      },
      include: {
        user: true,
        workspaces: {
          include: {
            chatWorkSpace: {
              include: {
                user: true,
              },
            },
          },
        },
        Friend: {
          include: {
            friend: {
              include: {
                user: {
                  include: {
                    chatWorkSpaces: {
                      include: {
                        Friend: {
                          where: {
                            workspace: {
                              id: workspace,
                            },
                            friend: {
                              id: user1.id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },

            chat: {
              include: {
                msges: {
                  include: {
                    from: true,
                    replys: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    let toSendUser1;
    let toSendUser2;
    user1_msg.Friend.forEach((x) => {
      console.log(x);
      if (x.chatId === chatId) {
        toSendUser1 = x;
      }
    });
    user2_msg.Friend.find((x) => {
      console.log(x);
      if (x.chatId === chatId) {
        toSendUser2 = x;
      }
    });
    return { toSendUser1, toSendUser2 };
  } catch (error) {
    console.log(error);
  }
}

async function incrementUnread(friendId) {
  try {
    let prisma = getDb();
    await prisma.friend.update({
      where: {
        id: friendId,
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
async function ZeroUnread(friednId) {
  try {
    let prisma = getDb();
    await prisma.friend.update({
      where: { id: friednId },
      data: { unRead: 0 },
    });
  } catch (error) {
    throw error;
  }
}
async function setMute(friendId: string, mute: boolean) {
  try {
    let prisma = getDb();
    await prisma.friend.update({
      where: {
        id: friendId,
      },
      data: {
        muted: mute,
      },
    });
  } catch (error) {
    throw error;
  }
}
export {
  createUser,
  getUserData,
  getInvite,
  createInvite,
  searchUser,
  sendEmailInvite,
  makeUserAFriend,
  incrementUnread,
  ZeroUnread,
  setMute,
};
