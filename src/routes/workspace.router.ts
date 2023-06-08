import { Router } from "express";
import { handleCreateWorkSpace } from "../controllers/workspace.controller";
import { verifyUser } from "../middleware/auth.middleware";

let workSpaceRouter = Router();
workSpaceRouter.post("/create", verifyUser, handleCreateWorkSpace);

export { workSpaceRouter };
