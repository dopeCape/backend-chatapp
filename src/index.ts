//imports
import Express, { Application, Request, Response } from "express";
import request from "requests";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import * as httpProxy from "http-proxy";
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
const port: Number | String = process.env.PORT || 8000; //env.PORT for getting port number allocted by backend
app.use(Express.json());
app.get("/del", deleteAll);
app.use(Express.json());
app.use(cors()); // to avoid cors errors
app.use(morgan("tiny")); //to log every request to rest api
app.get("/test", (_: Request, res: Response): void => {
  res.send("app works");
});
let prisma: PrismaClient;
const apiProxy = httpProxy.createProxyServer();
app.use("/user", userRouter); //users router
app.use("/msges", msgRouter); //msges router
app.use("/test", testRouter); //nested test router
app.use("/workspace", workSpaceRouter); //workspace router
app.use("/gchat", groupChatRouter); //groupchat router
app.post("/download", (req, res) => {
  let url = req.body.url;
  let fileName = req.body.filename;
  const options = {
    url: url,
    encoding: null, // Set encoding to null to keep the response as binary data
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  };

  request.get(options, (error, response, body) => {
    if (error) {
      console.error(error);
      res.status(500).send("An error occurred while downloading the file");
    } else {
      // Set the headers for file download
      res.set(response.headers);
      res.send(body);
    }
  });
});
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
