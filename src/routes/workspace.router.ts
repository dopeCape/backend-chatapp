import { Router } from "express";
import {
  handleCreateWorkSpace,
  handleRemoveFromWorkspce,
  handleUpdateWorkspace,
} from "../controllers/workspace.controller";
import { verifyUser } from "../middleware/auth.middleware";

let workSpaceRouter = Router();
workSpaceRouter.post("/create", verifyUser, handleCreateWorkSpace);
workSpaceRouter.post("/update", verifyUser, handleUpdateWorkspace);
workSpaceRouter.post("/removeuser", verifyUser, handleRemoveFromWorkspce);

export { workSpaceRouter };
