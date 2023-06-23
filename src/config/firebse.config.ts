import * as admin from "firebase-admin";

import dotenv from "dotenv";
dotenv.config();
let firebaseKeys;
if (process.env.NODE_ENV == "PROD") {
  firebaseKeys = process.env.FIREBASE_KEYS_PROD;
} else if (process.env.NODE_ENV == "DEV") {
  firebaseKeys = process.env.FIREBASE_KEYS_DEV;
}

const firebase_private_key_b64 = Buffer.from(firebaseKeys, "base64");
const firebase_private_key = firebase_private_key_b64.toString("utf8");
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(firebase_private_key)),
});

export { admin };
