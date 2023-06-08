"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
// import {
//   handleChelckUserName,
//   handleGauth,
//   handleGetUserData,
//   handleSearchUser,
//   handleSetUserData,
// } from "../controllers/users.controller";
const auth_middleware_1 = require("../middleware/auth.middleware");
const users_controller_1 = require("../controllers/users.controller");
const userRouter = (0, express_1.Router)();
exports.userRouter = userRouter;
userRouter.get("/:userId", auth_middleware_1.verifyUser, users_controller_1.handleGetUserData);
userRouter.post("/", auth_middleware_1.verifyUser, users_controller_1.handleSetUserData);
// userRouter.post("/chelck", handleChelckUserName);
userRouter.post("/gauth", auth_middleware_1.verifyUser, users_controller_1.handleGauth);
userRouter.post("/chelckinvite", users_controller_1.handleChelckInvite);
userRouter.post("/search", auth_middleware_1.verifyUser, users_controller_1.handleFindUsers);
userRouter.post("/invite", auth_middleware_1.verifyUser, users_controller_1.handleAddToWorkSpace);
userRouter.post("/email", auth_middleware_1.verifyUser, users_controller_1.handleEmailInvtes);
