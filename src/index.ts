//imports
import Express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { connectDB } from "./config/db.config";
import { verifyUser } from "./middleware/auth.middleware";
import { userRouter } from "./routes/user.router";
import { ably_endpoints } from "./services/ably.service";
import { msgRouter } from "./routes/msges.router";
//end

//for reading env files.
dotenv.config();

export const app: Application = Express();
const port: Number | String = process.env.PORT || 9000; //env.PORT for getting port number allocted by backend

app.use(Express.json());
app.use(cors()); // to avoid cors errors
app.use(morgan("tiny")); //to log every request to rest api

ably_endpoints(); //to register alby endpoints .

app.get("/test", verifyUser, (_: Request, res: Response): void => {
  res.send("applicion works");
});

app.use("/user", userRouter); //users router
app.use("/msges", msgRouter); //msges router
// l
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

start(); //main function
