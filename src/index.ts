//imports
import Express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import { verifyUser } from "./middleware/auth.middleware";
import { userRouter } from "./routes/user.router";
import { msgRouter } from "./routes/msges.router";
import { connectDb, getDb } from "./config/db.config";
import { workSpaceRouter } from "./routes/workspace.router";

import { groupChatRouter } from "./routes/groupchat.router";
import { deleteAll } from "./modules/workspace.module";
import { testRouter } from "./routes/test.router";
import { PrismaClient } from "@prisma/client";
//end

//for reading env files.
dotenv.config();

const app: Application = Express();
const port: Number | String = process.env.PORT || 9000; //env.PORT for getting port number allocted by backend

app.use(Express.json());

app.get("/del", deleteAll);
app.use(cors()); // to avoid cors errors
app.use(morgan("tiny")); //to log every request to rest api
app.get("/test", (_: Request, res: Response): void => {
  res.send("app works");
});
let prisma: PrismaClient;
app.use("/user", userRouter); //users router
app.use("/msges", msgRouter); //msges router
app.use("/test", testRouter); //nested test router
app.use("/workspace", workSpaceRouter); //workspace router
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
export default app;
