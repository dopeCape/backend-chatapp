import Ably from "ably";
import dotenv from "dotenv";

dotenv.config();
const ably_key = process.env.ABLY;

const ably = new Ably.Rest({ key: ably_key });
async function ablyTokenCreater(clienId) {
  let token;
  ably.auth.createTokenRequest(
    { clientId: clienId },
    null,
    (err, tokenRequest) => {
      token = tokenRequest;
      /* tokenRequest => {
       "capability": "{\"*\":[\"*\"]}",
       "clientId": "client@example.com",
       "keyName": "{{API_KEY_NAME}}",
       "nonce": "5576521221082658",
       "timestamp": {{MS_SINCE_EPOCH}},
       "mac": "GZRgXssZDCegRV....EXAMPLE"
     } */
    }
  );
  return token;
}

export { ablyTokenCreater };
