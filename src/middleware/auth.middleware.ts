import { admin } from "../config/firebse.config.js";
async function verifyUser(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  try {
    let decoded_token = await admin.auth().verifyIdToken(token);
    if (decoded_token) {
      req.body.userId = decoded_token.user_id;
      return next();
    } else {
      res.json({ message: "unauthorized request" });
    }
  } catch (error) {
    console.log(error);

    res.json({ message: "internal server error" });
  }
}

export { verifyUser };
