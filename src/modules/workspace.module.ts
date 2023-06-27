import { type } from "@prisma/client";
import { getDb } from "../config/db.config";

async function addUserToWorkSpace(
  chatWorkspaceId: string,
  name: string,
  email: string,
  source: String,
  workSpaceId?
) {
  try {
    let prisma = getDb();
    if (source == "email") {
      let invite_ = await prisma.invites.delete({
        where: { email: email },
        include: {
          workspace: {
            include: {
              chatWorkSpace: {
                include: {
                  groupChatRef: {
                    where: {
                      groupChat: {
                        name: {
                          search: "general",
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

      let workspace_ = await prisma.workspace.update({
        where: {
          id: invite_.workspace[0].id,
        },
        data: {
          chatWorkSpace: {
            connect: {
              id: chatWorkspaceId,
            },
          },
        },
        include: {
          chatWorkSpace: {
            include: { user: true },
          },
          groupChat: true,
        },
      });
      let msg_ = await prisma.msges.create({
        data: {
          content: `${name} joined ${workspace_.name}`,
          type: type.CMD,
        },
      });

      let groupChat = workspace_.groupChat.find((x) => {
        return x.name == "general";
      });
      let groupChatId = groupChat.id;

      let groupChat_ = await prisma.groupChat.update({
        where: {
          id: groupChatId,
        },
        data: {
          msges: {
            connect: { id: msg_.id },
          },
        },
      });
      let groupChatRef_ = await prisma.groupChatRef.create({
        data: {
          user: {
            connect: {
              id: chatWorkspaceId,
            },
          },
          groupChat: {
            connect: {
              id: groupChat_.id,
            },
          },
        },
        include: {
          groupChat: {
            include: {
              msges: {
                include: {
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
          user: {
            include: {
              user: true,
            },
          },
        },
      });

      await prisma.chatWorkSpace.update({
        where: {
          id: chatWorkspaceId,
        },
        data: {
          groupChatRef: {
            connect: { id: groupChatRef_.id },
          },
        },
      });

      return { msg_, workspace_, groupChatId, groupChatRef_ };
    } else {
      let workspace_ = await prisma.workspace.update({
        where: {
          id: workSpaceId,
        },
        data: {
          chatWorkSpace: {
            connect: {
              id: chatWorkspaceId,
            },
          },
        },
        include: {
          chatWorkSpace: {
            include: { user: true },
          },
          groupChat: true,
        },
      });
      let msg_ = await prisma.msges.create({
        data: {
          content: `${name} joined ${workspace_.name}`,
          type: type.CMD,
        },
      });

      let groupChat = workspace_.groupChat.find((x) => {
        return x.name == "general";
      });
      let groupChatId = groupChat.id;

      let groupChat_ = await prisma.groupChat.update({
        where: {
          id: groupChatId,
        },
        data: {
          msges: {
            connect: { id: msg_.id },
          },
        },
        include: {
          msges: {
            include: {
              replys: true,
            },
          },
        },
      });
      let groupChatRef_ = await prisma.groupChatRef.create({
        data: {
          user: {
            connect: {
              id: chatWorkspaceId,
            },
          },
          groupChat: {
            connect: {
              id: groupChat_.id,
            },
          },
        },
        include: {
          groupChat: {
            include: {
              msges: {
                include: {
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
          user: {
            include: {
              user: true,
            },
          },
        },
      });
      let user_ = await prisma.chatWorkSpace.update({
        where: {
          id: chatWorkspaceId,
        },
        data: {},
        include: {
          user: true,
        },
      });

      return {
        workspace_,
        groupChat_,
        msg_,
        groupChatId,
        user_,
        groupChatRef_,
      };
    }
  } catch (error) {
    throw error;
  }
}

async function createWrokspace(workspace, chatWorkspaceId, userId) {
  let prisma = getDb();
  console.log(workspace, chatWorkspaceId, userId);

  try {
    let user = await prisma.chatWorkSpace.findFirst({
      where: { id: chatWorkspaceId },
      include: { user: true },
    });
    let workspace_ = await prisma.workspace.create({
      data: {
        name: workspace.name,
        profilePic: workspace.profilePic,
        description: workspace.description,
        topic: workspace.topic,
        chatWorkSpace: {
          connect: {
            id: chatWorkspaceId,
          },
        },
      },
      include: {
        chatWorkSpace: true,
      },
    });
    let groupChat = await prisma.groupChatRef.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },

        groupChat: {
          create: {
            name: "general",
            workspace: { connect: { id: workspace_.id } },
            admin: {
              connect: {
                id: userId,
              },
            },
            msges: {
              create: {
                content: `${user.user.name} created ${workspace.name}`,
                type: type.CMD,
              },
            },
          },
        },
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
        user: true,
      },
    });
    let chatWorkSpace_ = await prisma.chatWorkSpace.update({
      where: { id: chatWorkspaceId },
      data: { workspaces: { connect: { id: workspace_.id } } },
      include: {
        workspaces: true,
      },
    });
    // return chatWorkSpace_;
    console.log(workspace_, groupChat, chatWorkSpace_);
    return { workspace_, groupChat, chatWorkSpace_ };
  } catch (error) {
    console.log(userId, "userid");
  }
}
async function upadteWorksSpace(workspaceId, workspace) {
  let prisma = getDb();
  try {
    let workspace_ = await prisma.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        name: workspace.name,
        description: workspace.description,
        topic: workspace.topic,
        profilePic: workspace.profilePic,
      },
      include: {
        chatWorkSpace: {
          include: {
            user: true,
          },
        },
      },
    });
    return workspace_;
  } catch (error) {
    throw error;
  }
}

async function deleteAll(req, res) {
  let prisma = getDb();
  try {
    // Delete all rows in the Friend table
    await prisma.chat.deleteMany({});

    // Delete all rows in the Friend table
    await prisma.friend.deleteMany({});

    // Delete all rows in the msges table
    await prisma.msges.deleteMany({});

    // Delete all rows in the groupChat table
    await prisma.groupChat.deleteMany({});

    // Delete all rows in the chatWorkSpace table
    await prisma.chatWorkSpace.deleteMany({});

    // Delete all rows in the User table
    await prisma.user.deleteMany({});

    // Delete all rows in the Invites table
    await prisma.invites.deleteMany({});

    // Delete all rows in the Workspace table
    await prisma.workspace.deleteMany({});
    res.send("dono");
  } catch (error) {
    console.log(error);
  }
}

export { createWrokspace, deleteAll, addUserToWorkSpace, upadteWorksSpace };
