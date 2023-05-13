"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msgRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const msg_controller_1 = require("../controllers/msg.controller");
let msgRouter = (0, express_1.Router)();
exports.msgRouter = msgRouter;
msgRouter.get("/:id", auth_middleware_1.verifyUser, msg_controller_1.handleGetAllMsg);
