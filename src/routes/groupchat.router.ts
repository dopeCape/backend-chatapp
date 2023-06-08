import { Router } from "express";
import {
  handleAddUseToGroup,
  handleCreateNewGroup,
  handleRemoveUser,
} from "../controllers/groupchat.controller";
import { verifyUser } from "../middleware/auth.middleware";

const groupChatRouter = Router();
groupChatRouter.post("/create", verifyUser, handleCreateNewGroup);

groupChatRouter.post("/add", verifyUser, handleAddUseToGroup);

groupChatRouter.post("/remove", verifyUser, handleRemoveUser);

export { groupChatRouter };
