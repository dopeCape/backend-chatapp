import mongoose from "mongoose";
import dotenv from "dotenv";
import { userSchema } from "../schema/user.schema";
import { msgSchema } from "../schema/msg.schema";
import { groupChatSchema } from "../schema/groupchat.schema";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const MONGO_URI = process.env.URI;
let DB;

async function connectDb() {
  DB = new PrismaClient();
}

function getDb(): PrismaClient {
  return DB;
}

export { getDb, connectDb };
