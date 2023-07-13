import { GroupChatvisibility, GroupupType } from "@prisma/client";
import {
  addMemebToGroup,
  createNewGruop,
  delteGroup,
  removeUser,
  setMute,
  setUnReadToZero,
} from "../modules/groupchat.module";
import {
  delelteGroupSender,
  newGroupChat,
  newMemberInGroup,
  removeMember,
  removedFromGroup,
} from "../services/ably.service";
import { types } from "util";
import { createSingleHistryEntry } from "../modules/history.module";
import { group } from "console";

async function handleCreateNewGroup(req, res, next) {
  try {
    let { workspaceId, users, user, name, type, visiblity } = req.body;
    if (visiblity == "PRIVATE") {
      visiblity = GroupChatvisibility.PRIVATE;
    } else {
      visiblity = GroupChatvisibility.PUBLIC;
    }
    if (type === "GROUP") {
      type == GroupupType.GROUP;
    } else {
      type == GroupupType.CHANNEL;
    }
    console.log(req.body);

    let chatRefs = await createNewGruop(
      workspaceId,
      users,
      user,
      name,
      type,
      visiblity
    );

    console.log(chatRefs);
    chatRefs.forEach((user) => {
      newGroupChat(user.user.user.id, user);
    });
    res.send("created");
  } catch (error) {
    next(error);
  }
}
const chelckIfArrayExistss = (array, element) => {
  let y = false;
  let index;
  array.forEach((x, i) => {
    if (x.user.id == element.user.id) {
      y = true;
      index = i;
    }
  });
  return { y, index };
};
async function handleAddUseToGroup(req, res, next) {
  try {
    let { users, workspaceId, groupChatId, name } = req.body;
    let {
      groupChatRefs,
      group_: groupChat,
      historyEntriesToSend,
    } = await addMemebToGroup(users, workspaceId, groupChatId, name);
    let groupChatRefsToSend = [];
    const to_send = ["chatWorkSpaceId", "groupChatId", "id", "unRead", "user"];
    groupChatRefs.forEach((x) => {
      const groupCHatRef__ = Object.fromEntries(
        Object.entries(x).filter(([key]) => to_send.includes(key))
      );
      groupChatRefsToSend.push(groupCHatRef__);
    });
    groupChat.groupChatRef.forEach(async (x) => {
      let { index, y } = chelckIfArrayExistss(groupChatRefs, x);
      if (y) {
        newGroupChat(groupChatRefs[index].user.user.id, groupChatRefs[index]);
      } else {
        let history = historyEntriesToSend.find((hr) => {
          return hr.userId === x.user.user.id;
        });
        newMemberInGroup(
          x.user.user.id,
          groupChat.id,
          groupChat.msges.at(-1),
          groupChatRefsToSend,
          history.history,
          history.historyId
        );
      }
    });
    res.send("ok");
  } catch (error) {
    next(error);
  }
}
async function handleRemoveUser(req, res, next) {
  try {
    let {
      msg,
      userid: userId,
      groupId,
      userxid,
      groupChatRefId,
      name,
      groupName,
    } = req.body;

    let { x, users, historyToSend } = await removeUser(
      msg,
      userId,
      groupId,
      groupChatRefId,
      name,
      groupName
    );

    users.forEach((y) => {
      if (y.id === userId) {
      } else {
        let history = historyToSend.find((x) => {
          return x.userId === y.user.user.id;
        });
        removeMember(
          y.user.user.id,
          x,
          userId,
          groupId,
          groupChatRefId,
          history.history,
          history.historyId
        );
      }
    });
    removedFromGroup(userxid, groupChatRefId);

    res.send("ok");
  } catch (error) {
    next(error);
  }
}
async function handeSetZero(req, res, next) {
  let data = req.body;

  try {
    await setUnReadToZero(data.id);
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}
async function handleDelteGroupChat(req, res, next) {
  try {
    let { groupChatId, groupChatRefs, users, name, groupName } = req.body;
    let { historyEntriesToSend } = await delteGroup(
      groupChatId,
      groupChatRefs,
      name,
      groupName
    );

    await Promise.all(
      users.map(async (id) => {
        let history = historyEntriesToSend.find((x) => {
          return x.userId === id;
        });
        await delelteGroupSender(
          id,
          groupChatId,
          history.history,
          history.historyId
        );
      })
    );
    res.send("ok");
  } catch (error) {
    next(error);
  }
}
async function handleSetMute(req, res, next) {
  try {
    let { groupChatRefId, mute } = req.body;
    await setMute(groupChatRefId, mute);
    res.send("ok");
    res.status(200);
  } catch (error) {
    next(error);
  }
}

export {
  handleCreateNewGroup,
  handleAddUseToGroup,
  handleRemoveUser,
  handeSetZero,
  handleDelteGroupChat,
  handleSetMute,
};
