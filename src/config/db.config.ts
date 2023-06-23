import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
let DB;

async function connectDb() {
  DB = new PrismaClient();
}

function getDb(): PrismaClient {
  return DB;
}

export { getDb, connectDb };
