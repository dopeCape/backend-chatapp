import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";

import { handleGetAllMsg } from "../controllers/msg.controller";

let msgRouter = Router();

msgRouter.get("/:id", verifyUser, handleGetAllMsg);

export { msgRouter };
