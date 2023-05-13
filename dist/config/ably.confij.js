"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ablyTokenCreater = void 0;
const ably_1 = __importDefault(require("ably"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ably_key = process.env.ABLY;
const ably = new ably_1.default.Rest({ key: ably_key });
function ablyTokenCreater(clienId) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        ably.auth.createTokenRequest({ clientId: clienId }, null, (err, tokenRequest) => {
            token = tokenRequest;
            /* tokenRequest => {
             "capability": "{\"*\":[\"*\"]}",
             "clientId": "client@example.com",
             "keyName": "{{API_KEY_NAME}}",
             "nonce": "5576521221082658",
             "timestamp": {{MS_SINCE_EPOCH}},
             "mac": "GZRgXssZDCegRV....EXAMPLE"
           } */
        });
        return token;
    });
}
exports.ablyTokenCreater = ablyTokenCreater;
