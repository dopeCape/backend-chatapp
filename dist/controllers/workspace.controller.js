"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateWorkSpace = void 0;
const workspace_module_1 = require("../modules/workspace.module");
function handleCreateWorkSpace(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let workspace = {
                name: req.body.name,
            };
            let userId = req.body.userid;
            let chatWorkSpaceId = req.body.id;
            let { workspace_, groupChat, chatWorkSpace_ } = yield (0, workspace_module_1.createWrokspace)(workspace, chatWorkSpaceId, userId);
            res.status(201).send({ workspace_, groupChat, chatWorkSpace_ });
        }
        catch (error) {
            if (error.code == "P2002") {
                res.send({ workspace_: "P2002" });
            }
            // next(error);
        }
    });
}
exports.handleCreateWorkSpace = handleCreateWorkSpace;
