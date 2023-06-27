import { Router } from "express";
import {
  handleCreateWorkSpace,
  handleUpdateWorkspace,
} from "../controllers/workspace.controller";
import { verifyUser } from "../middleware/auth.middleware";

let workSpaceRouter = Router();
workSpaceRouter.post("/create", verifyUser, handleCreateWorkSpace);
workSpaceRouter.post("/update", verifyUser, handleUpdateWorkspace);

export { workSpaceRouter };
