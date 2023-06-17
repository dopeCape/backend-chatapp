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
  handleSetUserData,
} from "../controllers/users.controller";

const userRouter = Router();

userRouter.get("/:userId", verifyUser, handleGetUserData);
userRouter.post("/", verifyUser, handleSetUserData);
// userRouter.post("/chelck", handleChelckUserName);
userRouter.post("/gauth", verifyUser, handleGauth);
userRouter.post("/chelckinvite", handleChelckInvite);
userRouter.post("/search", verifyUser, handleFindUsers);

userRouter.post("/invite", verifyUser, handleAddToWorkSpace);
userRouter.get("/test", (req, res) => {
  res.json("it works!!! ");
});

userRouter.post("/email", verifyUser, handleEmailInvtes);
// userRouter.get("/search/:q", verifyUser, handleSearchUser);

export { userRouter };
