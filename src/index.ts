import Express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.config";
import { verifyUser } from "./middleware/auth.middleware";
import { userRouter } from "./routes/user.router";

import {
  handleDelteAllUsers,
  handleSendRequest,
} from "./controllers/users.controller";
import Ably from "ably";
import { ably_endpoints } from "./services/ably.service";
import { deleteAllUsers } from "./modules/user.module";
import { msgRouter } from "./routes/msges.router";

dotenv.config();

export const app: Application = Express();
const port: Number | String = process.env.PORT || 9000;

app.use(Express.json());
app.use(cors());
app.use(morgan("tiny"));

ably_endpoints(); //to register alby endpoints .

app.get("/test", verifyUser, (req: Request, res: Response): void => {
  res.send("hee");
});

app.get("/delete", handleDelteAllUsers);

app.use("/user", userRouter);
app.use("/msges", msgRouter);
async function start() {
  try {
    await connectDB();
  } catch (error) {
    console.error(error);
  }
  app.listen(port, () => {
    console.log("app listning on port:", port);
  });
}

if (process.env.ENV === ("dev" || "prod")) {
  start();
}
