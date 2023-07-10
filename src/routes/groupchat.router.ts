import { Router } from "express";
import {
  handeSetZero,
  handleAddUseToGroup,
  handleCreateNewGroup,
  handleDelteGroupChat,
  handleRemoveUser,
  handleSetMute,
} from "../controllers/groupchat.controller";
import { verifyUser } from "../middleware/auth.middleware";

const groupChatRouter = Router();
groupChatRouter.post("/create", verifyUser, handleCreateNewGroup);
groupChatRouter.post("/add", verifyUser, handleAddUseToGroup);
groupChatRouter.post("/remove", verifyUser, handleRemoveUser);
groupChatRouter.post("/delete", verifyUser, handleDelteGroupChat);
groupChatRouter.post("/mute", verifyUser, handleSetMute);
groupChatRouter.post("/unread", verifyUser, handeSetZero);

export { groupChatRouter };
