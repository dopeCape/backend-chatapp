import { GroupupType, chatWorkSpace } from "@prisma/client";
import { getDb } from "../config/db.config";

async function addHistroryEntryForNewMember(
  workspaceId: string,
  name: string,
  groupChatName: string,
  type: GroupupType,
  user: chatWorkSpace
) {
  try {
    let prisma = getDb();
    let msg_for_others = `${name} Joinded ${groupChatName}`;
    let msg_for_joinee = `You Joinded ${groupChatName}`;
    let historys = await prisma.history.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });
    let historys_ = [];
    await Promise.all(
      historys.map(async (entry) => {
        if (entry.chatWorkSpaceId === user.id) {
          let history = await prisma.historyEntryes.create({
            data: {
              content: msg_for_joinee,
              type: type,
              History: {
                connect: {
                  id: entry.id,
                },
              },
            },
          });
          historys_.push(history);
        } else {
          let history = await prisma.historyEntryes.create({
            data: {
              content: msg_for_others,
              type: type,
              History: {
                connect: {
                  id: entry.id,
                },
              },
            },
          });

          historys_.push(history);
        }
      })
    );
    return historys_;
  } catch (error) {
    throw error;
  }
}
async function addHistroryEntryForMemberRemove(
  workspaceId: string,
  name: string,
  groupChatName: string,
  type: GroupupType,
  user: chatWorkSpace
) {
  try {
    let prisma = getDb();
    let msg_for_others = `${name} Left ${groupChatName}`;
    let msg_for_joinee = `You Left ${groupChatName}`;
    let historys = await prisma.history.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });
    let historys_ = [];
    await Promise.all(
      historys.map(async (entry) => {
        if (entry.chatWorkSpaceId === user.id) {
          let history = await prisma.historyEntryes.create({
            data: {
              content: msg_for_joinee,
              type: type,
              History: {
                connect: {
                  id: entry.id,
                },
              },
            },
          });
          historys_.push(history);
        } else {
          let history = await prisma.historyEntryes.create({
            data: {
              content: msg_for_others,
              type: type,
              History: {
                connect: {
                  id: entry.id,
                },
              },
            },
          });
          historys_.push(history);
        }
      })
    );
    return historys_;
  } catch (error) {
    throw error;
  }
}
async function addHistroryEntryForGroupDelete(
  workspaceId: string,
  groupChatName: string,
  type: GroupupType
) {
  try {
    let prisma = getDb();
    let msg_for_others = `${groupChatName} was deleted`;
    let historys = await prisma.history.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });
    let historys_ = [];
    await Promise.all(
      historys.map(async (entry) => {
        let history = await prisma.historyEntryes.create({
          data: {
            content: msg_for_others,
            type: type,
            History: {
              connect: {
                id: entry.id,
              },
            },
          },
        });
        historys_.push(history);
      })
    );
    return historys_;
  } catch (error) {
    throw error;
  }
}

async function createSingleHistryEntry(
  msg: string,
  histryId: string,
  type: GroupupType
) {
  try {
    let prisma = getDb();
    let history = await prisma.historyEntryes.create({
      data: {
        content: msg,
        type: type,
        History: {
          connect: {
            id: histryId,
          },
        },
      },
    });
    return history;
  } catch (error) {
    throw error;
  }
}

export {
  addHistroryEntryForNewMember,
  addHistroryEntryForGroupDelete,
  addHistroryEntryForMemberRemove,
  createSingleHistryEntry,
};
