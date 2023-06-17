import Ably from "ably";
import dotenv from "dotenv";

dotenv.config();
const ably_key = process.env.ABLY;

const ably = new Ably.Rest({ key: ably_key });
async function ablyTokenCreater(clienId) {
  //this function issures a new client token when evern a client logs in
  let token;
  ably.auth.createTokenRequest(
    { clientId: clienId },
    null,
    (err, tokenRequest) => {
      token = tokenRequest;
    }
  );
  return token;
}

export { ablyTokenCreater };
