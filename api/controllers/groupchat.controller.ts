import {
  addMemebToGroup,
  createNewGruop,
  removeUser,
} from "../modules/groupchat.module";
import {
  newGroupChat,
  newMemberInGroup,
  removeMember,
  removedFromGroup,
} from "../services/ably.service";

async function handleCreateNewGroup(req, res, next) {
  try {
    let { workspaceId, users, user, name } = req.body;
    console.log(req.body);

    let chatRefs = await createNewGruop(workspaceId, users, user, name);

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
    let { groupChatRefs, group_: groupChat } = await addMemebToGroup(
      users,
      workspaceId,
      groupChatId,
      name
    );
    let groupChatRefsToSend = [];
    const to_send = ["chatWorkSpaceId", "groupChatId", "id", "unRead", "user"];
    groupChatRefs.forEach((x) => {
      const groupCHatRef__ = Object.fromEntries(
        Object.entries(x).filter(([key]) => to_send.includes(key))
      );
      groupChatRefsToSend.push(groupCHatRef__);
    });

    groupChat.groupChatRef.forEach((x) => {
      let { index, y } = chelckIfArrayExistss(groupChatRefs, x);
      if (y) {
        console.log(groupChatRefs[index].user.user);
        newGroupChat(groupChatRefs[index].user.user.id, groupChatRefs[index]);
      } else {
        newMemberInGroup(
          x.user.user.id,
          groupChat.id,
          groupChat.msges.at(-1),
          groupChatRefsToSend
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
    let { msg, userid: userId, groupId, userxid, groupChatRefId } = req.body;

    let { x, users } = await removeUser(msg, userId, groupId, groupChatRefId);

    users.forEach((y) => {
      if (y.id === userId) {
      } else {
        removeMember(y.user.user.id, x, userId, groupId, groupChatRefId);
      }
    });
    removedFromGroup(userxid, groupChatRefId);

    res.send("ok");
  } catch (error) {
    next(error);
  }
}

export { handleCreateNewGroup, handleAddUseToGroup, handleRemoveUser };
