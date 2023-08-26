import { Role } from "@prisma/client";
import { User } from "@prisma/client";
import { ablyTokenCreater } from "../config/ably.confij";
import Ably from "ably";
const ably_key = process.env.ABLY; //ably api key
const ably_client = new Ably.Realtime.Promise(ably_key);

async function handleAddToWorkSpace(req, res, next) {
  let users = req.body.users;
  let workSpaceId = req.body.id;
  await Promise.all(
    users.map(async (user) => {
      let { chatWorkSpaceId, name, email, user_ } = user;
      try {
        let {
          msg_,
          workspace_,
          groupChatId,
          groupChat_,
          user_,
          groupChatRef_,
        } = await addUserToWorkSpace(
          chatWorkSpaceId,
          name,
          email,
          null,
          workSpaceId
        );
        const to_send = [
          "chatWorkSpaceId",
          "groupChatId",
          "id",
          "unRead",
          "user",
        ];
        const groupCHatRef__ = Object.fromEntries(
          Object.entries(groupChatRef_).filter(([key]) => to_send.includes(key))
        );
        workspace_.chatWorkSpace.map((x) => {
          if (x.user.id != user_.user.id) {
            newMemeberInWorkspce(
              x.user.id,
              msg_,
              groupCHatRef__,
              groupChatId,
              workSpaceId,
              user_
            );
          } else {
            newMemeberAdder(user_.user.id, workspace_, groupChatRef_);
          }
        });
        res.send({
          msg: "added",
        });
      } catch (error) {
        next(error);
      }
    })
  );
  // let { chatWorkSpaceId, name, email, user_, workSpaceId } = req.body;
  // try {
  //   let { msg_, workspace_, groupChatId, groupChat_, user_, groupChatRef_ } =
  //     await addUserToWorkSpace(chatWorkSpaceId, name, email, null, workSpaceId);
  //   const to_send = ["chatWorkSpaceId", "groupChatId", "id", "unRead", "user"];
  //   const groupCHatRef__ = Object.fromEntries(
  //     Object.entries(groupChatRef_).filter(([key]) => to_send.includes(key))
  //   );
  //   workspace_.chatWorkSpace.map((x) => {
  //     if (x.user.id != user_.user.id) {
  //       newMemeberInWorkspce(
  //         x.user.id,
  //         msg_,
  //         groupCHatRef__,
  //         groupChatId,
  //         workSpaceId,
  //         user_
  //       );
  //     } else {
  //       newMemeberAdder(user_.user.id, workspace_, groupChatRef_);
  //     }
  //   });
  //
  //   res.send({
  //     msg: "added",
  //   });
  // } catch (error) {
  //   next(error);
  // }
}

async function handleEmailInvtes(req, res, next) {
  let email = req.body.email;
  let workspaceId = req.body.workspaceId;
  let role = req.body.role;
  try {
    let invite = await sendEmailInvite(email, workspaceId, role);
    res.send({ invite });
  } catch (error) {
    next(error);
  }
}

async function handleChelckInvite(req: Request, res: Response, next) {
  let email = req.body.email;
  try {
    if (
      email == "tmank14319@gmail.com" ||
      email === "timeo@mattyoungmedia.com"
    ) {
      res.send({ msg: "ok" });
    } else {
      let invite = await getInvite(email);
      if (invite == null) {
        res.send({ msg: "nope" });
      } else {
        res.send({ msg: "ok" });
      }
    }
  } catch (error) {
    next(error);
  }
}

async function handleFindUsers(req, res, next) {
  let name = req.body.name;
  try {
    let users = await searchUser(name);
    res.send({ users });
  } catch (error) {
    next(error);
  }
}

async function handleGetUserData(req, res, next) {
  let fireBaseid = req.params.userId;
  try {
    let msges;
    let user_data = await getUserData(fireBaseid);
    let ably_token = await ablyTokenCreater(fireBaseid);

    res.json({ user_data, ably_token });
    res.status(201);
  } catch (error) {
    next(error);
  }
}

async function handleGauth(req: Request, res: Response, next) {
  let { fireBaseid, name, profilePic, email } = req.body;

  try {
    let user = await getUserData(fireBaseid);

    if (user != null) {
      res.json({ user_data: user });
      res.status(201);
    } else {
      let admin;
      if (email === "tmank14319@gmail.com") {
        admin = true;
      } else {
        admin = false;
      }
      let role = await getInvite(email);
      let role_: Role;
      if (role != null || email == "tmank14319@gmail.com") {
        if (email == "tmank14319@gmail.com") {
          role_ = Role.MEMBER;
        } else {
          if (role.role == Role.MEMBER) {
            role_ = Role.MEMBER;
          } else {
            role_ = Role.EXTERNAL;
          }
        }
        try {
          let user_ = { fireBaseid, name, profilePic, email, admin, role_ };
          let user_data = await createUser(user_);

          let ably_token = await ablyTokenCreater(fireBaseid);

          res.json({ user_data, ably_token });
          res.status(201);
        } catch (error) {
          next(error);
        }
      } else {
        res.send({ user_data: "not invited" });
      }
    }
  } catch (error) {
    next(error);
  }
}

import {
  ZeroUnread,
  createInvite,
  createUser,
  delteFriend,
  findOtherFriend,
  getInvite,
  getUserData,
  incrementUnread,
  makeUserAFriend,
  searchUser,
  sendEmailInvite,
  setMute,
} from "../modules/user.module";
import { Request, Response } from "express";
import { addUserToWorkSpace } from "../modules/workspace.module";
import {
  newMemeberAdder,
  newMemeberInWorkspce,
  unfriendSender,
} from "../services/ably.service";

//
async function handleSetUserData(req, res, next) {
  let { fireBaseid, name, profilePic, email, workspaceId, groupChatId } =
    req.body;
  let admin: boolean;
  admin = true;
  let role = await getInvite(email);
  let role_: Role;
  if (
    role != null ||
    email == "tmank14319@gmail.com" ||
    email == "piyush@test.com"
  ) {
    if (email == "tmank14319@gmail.com" || email == "piyush@test.com") {
      role_ = Role.MEMBER;
    } else {
      if (role.role == Role.MEMBER) {
        role_ = Role.MEMBER;
      } else {
        role_ = Role.EXTERNAL;
      }
    }
    try {
      let user_ = { fireBaseid, name, profilePic, email, admin, role_ };
      let user_data;
      if (email === "tmank14319@gmail.com" || email == "piyush@test.com") {
        user_data = await createUser(user_, null, null);
      } else {
        let {
          created_user_: user_data,
          workspace_,
          msg_,
          user_: user__,
          groupChatId,
          groupChatRef_,
        } = await createUser(user_, "x", "x");
        let groupChatRefToSend = groupChatRef_;
        delete groupChatRefToSend.groupChat;
        await Promise.all(
          workspace_.chatWorkSpace.map(async (x) => {
            if (x.user.id != user__.user.id) {
              await newMemeberInWorkspce(
                x.user.id,
                msg_,
                groupChatRef_,
                groupChatId,
                user_data.chatWorkSpaces.workspaces[0].id,
                user__
              );
            }
          })
        );
      }
      let ably_token = await ablyTokenCreater(fireBaseid);
      res.json({ user_data, ably_token });
      res.status(201);
    } catch (error) {
      next(error);
    }
  } else {
    res.send({ user_data: "not invited" });
  }
}
async function handleNewChat(req, res, next) {
  try {
    let data = req.body;
    let user1Channel = ably_client.channels.get(data.user1.user.id);
    let user2Channel = ably_client.channels.get(data.user2.user.id);
    let user1 = data.user1;
    let user2 = data.user2;
    let workspace = data.workspace;
    let { toSendUser1: user1_, toSendUser2: user2_ } = await makeUserAFriend(
      user1,
      user2,
      workspace
    );
    console.log(user1_, user2_);

    // let c1id = user1_.chat.workspaceId;
    // let c2id = user2_.chat.workspaceId;
    // delete user1_.chat;
    // delete user2_.chat;
    // let user1__ = { ...user1_, chat: { workspaceId: c1id } };
    // let user2__ = { ...user2_, chat: { workspaceId: c2id } };
    user1Channel.publish("new-chat", { data: user1_ });
    user2Channel.publish("new-chat", { data: user2_ });
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}
async function handleAddUnread(data) {
  try {
    let friendId = data.friendId;
    await incrementUnread(friendId);
  } catch (error) {
    throw error;
  }
}

async function handleRead(req, res, next) {
  try {
    let data = req.body;
    let friendId = data.id;
    await ZeroUnread(friendId);
    res.send("ok");
  } catch (error) {
    next(error);
  }
}
async function handleSendBulkInvites(req, res, next) {
  try {
    let invtes = req.body.invites;
    let workspaceId = req.body.id;
    await Promise.all(
      invtes.map(async (invi) => {
        invi.role = Role.MEMBER;
        let x = await sendEmailInvite(invi.name, workspaceId, invi.role);
        console.log(x);
      })
    );
    res.send("ok");
  } catch (error) {
    console.log(error);
  }
}
async function handleMute(req, res, next) {
  try {
    let { friendId, mute } = req.body;
    await setMute(friendId, mute);
    res.send("ok");
    res.status(200);
  } catch (error) {
    console.log(error);
  }
}
async function handleUnfriend(req, res, next) {
  try {
    let { id, uid, friendId, workspaceId, chatId } = req.body;
    let friendId2 = await findOtherFriend(id, workspaceId);
    await delteFriend([{ id: friendId }, { id: friendId2.id }], chatId);
    await unfriendSender(uid, friendId2.chatWorkSpace.id, workspaceId);
    await unfriendSender(friendId2.chatWorkSpace.user.id, id, workspaceId);
    res.send("ok");
  } catch (error) {
    next(error);
  }
}

export {
  handleSetUserData,
  handleGauth,
  handleGetUserData,
  handleChelckInvite,
  handleFindUsers,
  handleEmailInvtes,
  handleAddToWorkSpace,
  handleNewChat,
  handleRead,
  handleAddUnread,
  handleSendBulkInvites,
  handleMute,
  handleUnfriend,
};
