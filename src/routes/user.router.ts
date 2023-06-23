import { Router } from "express";
// import {
//   handleChelckUserName,
//   handleGauth,
//   handleGetUserData,
//   handleSearchUser,
//   handleSetUserData,
// } from "../controllers/users.controller";
import { verifyUser } from "../middleware/auth.middleware";
import {
  handleAddToWorkSpace,
  handleChelckInvite,
  handleEmailInvtes,
  handleFindUsers,
  handleGauth,
  handleGetUserData,
  handleNewChat,
  handleRead,
  handleSendBulkInvites,
  handleSetUserData,
} from "../controllers/users.controller";

const userRouter = Router();

userRouter.get("/:userId", verifyUser, handleGetUserData);
userRouter.post("/", verifyUser, handleSetUserData);
userRouter.post("/gauth", verifyUser, handleGauth);
userRouter.post("/chelckinvite", handleChelckInvite);
userRouter.post("/search", verifyUser, handleFindUsers);
userRouter.post("/invite", verifyUser, handleAddToWorkSpace);
userRouter.post("/email", verifyUser, handleEmailInvtes);
userRouter.post("/newchat", verifyUser, handleNewChat);
userRouter.post("/handleread", verifyUser, handleRead);

userRouter.post("/sendbinites", verifyUser, handleSendBulkInvites);

export { userRouter };
