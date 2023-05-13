import admin from "firebase-admin";
import fig from "../firebaseconfig.json";

admin.initializeApp({
  credential: admin.credential.cert(fig),
});

export { admin };
