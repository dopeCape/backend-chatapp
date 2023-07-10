import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import {
  handleDeleteMsg,
  handleDeleteMsgGroup,
  handleEditMsg,
  handleEditMsgGroup,
  handleNewMsg,
  handleNewMsgGroup,
} from "../controllers/msg.controller";
let msgRouter = Router();
msgRouter.post("/newgroupmsg", verifyUser, handleNewMsgGroup);
msgRouter.post("/newmsg", verifyUser, handleNewMsg);
msgRouter.post("/deletemsg", verifyUser, handleDeleteMsg);
msgRouter.post("/deletemsggroup", verifyUser, handleDeleteMsgGroup);
msgRouter.post("/editmsg", verifyUser, handleEditMsg);
msgRouter.post("/editmsggroup", verifyUser, handleEditMsgGroup);
export { msgRouter };
