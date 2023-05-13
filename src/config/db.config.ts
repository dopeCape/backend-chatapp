import mongoose from "mongoose";
import dotenv from "dotenv";
import { userSchema } from "../schema/user.schema";
import { msgSchema } from "../schema/msg.schema";

dotenv.config();
const MONGO_URI = process.env.URI;
let DB;

async function connectDB() {
  try {
    DB = await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error(error);
  }
}

function getDB() {
  return DB;
}

async function getUserCollection() {
  try {
    let userCol = mongoose.model("users", userSchema);
    return userCol;
  } catch (error) {
    console.error(error);
  }
}
async function getMsgCollection() {
  try {
    let msgCol = mongoose.model("msges", msgSchema);
    return msgCol;
  } catch (error) {
    console.error(error);
  }
}

export { connectDB, getDB, getUserCollection, getMsgCollection };
