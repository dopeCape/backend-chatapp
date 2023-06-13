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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
//imports
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const user_router_1 = require("./routes/user.router");
const ably_service_1 = require("./services/ably.service");
const msges_router_1 = require("./routes/msges.router");
const db_config_1 = require("./config/db.config");
const workspace_router_1 = require("./routes/workspace.router");
const groupchat_router_1 = require("./routes/groupchat.router");
const workspace_module_1 = require("./modules/workspace.module");
//end
//for reading env files.
dotenv_1.default.config();
exports.app = (0, express_1.default)();
const port = process.env.PORT || 9000; //env.PORT for getting port number allocted by backend
exports.app.use(express_1.default.json());
exports.app.get("/del", workspace_module_1.deleteAll);
exports.app.use((0, cors_1.default)()); // to avoid cors errors
exports.app.use((0, morgan_1.default)("tiny")); //to log every request to rest api
(0, ably_service_1.ably_endpoints)(); //to register alby endpoints .
exports.app.get("/test", auth_middleware_1.verifyUser, (_, res) => {
    res.send("applicion works");
});
let prisma;
exports.app.use("/user", user_router_1.userRouter); //users router
exports.app.use("/msges", msges_router_1.msgRouter); //msges router
exports.app.use("/workspace", workspace_router_1.workSpaceRouter); //workspace routee
exports.app.use("/gchat", groupchat_router_1.groupChatRouter); //groupchat router
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_config_1.connectDb)();
            prisma = (0, db_config_1.getDb)();
        }
        catch (e) {
            console.error(e);
        }
        exports.app.listen(port, () => {
            console.log("app listning on port:", port);
        });
    });
}
start().then(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); })); //main function
