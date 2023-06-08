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

    let group_ = await createNewGruop(workspaceId, users, user, name);

    group_.user.forEach((user) => {
      newGroupChat(user.user.id, group_);
    });
    res.send("created");
  } catch (error) {
    next(error);
  }
}
const chelckIfArrayExistss = (array, element) => {
  let y = false;
  array.forEach((x) => {
    if (x.id == element.id) {
      y = true;
    }
  });
  return y;
};

async function handleAddUseToGroup(req, res, next) {
  try {
    let { users, workspaceId, groupChatId, name } = req.body;
    let groupChat = await addMemebToGroup(
      users,
      workspaceId,
      groupChatId,
      name
    );
    groupChat.user.forEach((x) => {
      if (chelckIfArrayExistss(users, x)) {
        newGroupChat(x.user.id, groupChat);
      } else {
        newMemberInGroup(
          x.user.id,
          groupChat.id,
          groupChat.msges.at(-1),
          users
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
    let { msg, userid: userId, groupId, userxid } = req.body;

    let { x, users } = await removeUser(msg, userId, groupId);

    console.log(users);

    users.forEach((y) => {
      if (y.id === userId) {
      } else {
        removeMember(y.user.id, x, userId, groupId);
      }
    });

    removedFromGroup(userxid, groupId);

    res.send("ok");
  } catch (error) {
    next(error);
  }
}

export { handleCreateNewGroup, handleAddUseToGroup, handleRemoveUser };
