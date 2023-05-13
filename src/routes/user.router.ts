import { Router } from "express";
import {
  handleChelckUserName,
  handleGauth,
  handleGetUserData,
  handleSearchUser,
  handleSetUserData,
} from "../controllers/users.controller";
import { verifyUser } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/:userId", verifyUser, handleGetUserData);

userRouter.post("/", verifyUser, handleSetUserData);
userRouter.post("/chelck", handleChelckUserName);
userRouter.post("/gauth", verifyUser, handleGauth);
userRouter.get("/search/:q", verifyUser, handleSearchUser);

export { userRouter };
