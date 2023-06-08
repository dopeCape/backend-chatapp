"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workSpaceRouter = void 0;
const express_1 = require("express");
const workspace_controller_1 = require("../controllers/workspace.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
let workSpaceRouter = (0, express_1.Router)();
exports.workSpaceRouter = workSpaceRouter;
workSpaceRouter.post("/create", auth_middleware_1.verifyUser, workspace_controller_1.handleCreateWorkSpace);
