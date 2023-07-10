import { Response } from "express";
import {
  createWrokspace,
  removeUserFromWorkSpace,
  upadteWorksSpace,
} from "../modules/workspace.module";
import {
  deleteWorkspace,
  removeMemberFromWorkspace,
  updateWorkspace,
} from "../services/ably.service";
import { deleteAllFriends } from "../modules/user.module";
import { delteFromAllGroup } from "../modules/groupchat.module";

async function handleCreateWorkSpace(req, res: Response, next) {
  try {
    let workspace = {
      name: req.body.name,
      topic: req.body.topic,
      description: req.body.description,
      profilePic: req.body.profilePic,
    };
    let userId = req.body.userid;
    let chatWorkSpaceId = req.body.id;
    let { workspace_, groupChat, chatWorkSpace_ } = await createWrokspace(
      workspace,
      chatWorkSpaceId,
      userId
    );
    res.status(201).send({ workspace_, groupChat, chatWorkSpace_ });
  } catch (error) {
    if (error.code == "P2002") {
      res.send({ workspace_: "P2002" });
    }
    console.log(error);
    // next(error);
  }
}
async function handleUpdateWorkspace(req, res, next) {
  try {
    let workspace = {
      name: req.body.name,
      description: req.body.description,
      topic: req.body.topic,
      profilePic: req.body.profilePic,
    };

    console.log(workspace);
    let worksapce_ = await upadteWorksSpace(req.body.id, workspace);

    await Promise.all(
      worksapce_.chatWorkSpace.map(async (user) => {
        await updateWorkspace(user.user.id, worksapce_.id, workspace);
      })
    );
    res.status(201).send("ok");
  } catch (error) {
    console.log(error);
  }
}
async function handleRemoveFromWorkspce(req, res, next) {
  try {
    let userId = req.body.id;
    let workspaceId = req.body.workspaceId;
    let friendsToSend = await deleteAllFriends(userId, workspaceId);
    let groupChatMapTousers = await delteFromAllGroup(userId, workspaceId);
    let { users: users_to_send, id } = await removeUserFromWorkSpace(
      workspaceId,
      userId
    );

    await Promise.all(
      users_to_send.map(async (user) => {
        let groupChatsToSend = groupChatMapTousers.map((mapedGroup) => {
          let userId = mapedGroup.users.find((user_) => {
            return user.id === user_;
          });
          console.log(userId);
          if (userId[0] !== undefined) {
            let groupChatId = mapedGroup.groupChatId;
            let admin = mapedGroup.admin;
            let groupChatRefId = mapedGroup.groupChatRefId;
            let msg = mapedGroup.msg;

            return { groupChatId, admin, groupChatRefId, msg };
          }
        });
        console.log(groupChatsToSend);

        let friendId_ = friendsToSend.find(
          (x) => x.chatWorkSpaceId === user.id
        );
        let friendId = friendId_?.friendId;
        await removeMemberFromWorkspace(
          user.user.id,
          userId,
          friendId,
          groupChatsToSend,
          workspaceId
        );
      })
    );
    deleteWorkspace(id, workspaceId);

    res.status(201).send("ok");
  } catch (error) {
    console.log(error);
    next(error);
  }
}
export {
  handleCreateWorkSpace,
  handleUpdateWorkspace,
  handleRemoveFromWorkspce,
};
