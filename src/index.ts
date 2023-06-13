//imports
import Express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { verifyUser } from "./middleware/auth.middleware";
import { userRouter } from "./routes/user.router";
import { ably_endpoints } from "./services/ably.service";
import { msgRouter } from "./routes/msges.router";
import { connectDb, getDb } from "./config/db.config";
import { workSpaceRouter } from "./routes/workspace.router";

import { groupChatRouter } from "./routes/groupchat.router";
import { deleteAll } from "./modules/workspace.module";
//end

//for reading env files.
dotenv.config();

export const app: Application = Express();
const port: Number | String = process.env.PORT || 9000; //env.PORT for getting port number allocted by backend

app.use(Express.json());

// app.get("/del", deleteAll);
app.use(cors()); // to avoid cors errors
app.use(morgan("tiny")); //to log every request to rest api

ably_endpoints(); //to register alby endpoints .

app.get("/test", verifyUser, (_: Request, res: Response): void => {
  res.send("applicion works");
});

let prisma;
app.use("/user", userRouter); //users router
app.use("/msges", msgRouter); //msges router
app.use("/workspace", workSpaceRouter); //workspace routee
app.use("/gchat", groupChatRouter); //groupchat router
async function start() {
  try {
    await connectDb();
    prisma = getDb();
  } catch (e) {
    console.error(e);
  }
  app.listen(port, () => {
    console.log("app listning on port:", port);
  });
}

start().then(async () => await prisma.$disconnect()); //main function
