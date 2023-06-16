import * as admin from "firebase-admin";

import dotenv from "dotenv";
dotenv.config();

const firebase_private_key_b64 = Buffer.from(
  process.env.FIREBASE_KEYS,
  "base64"
);
const firebase_private_key = firebase_private_key_b64.toString("utf8");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebase_private_key)),
});

export { admin };
