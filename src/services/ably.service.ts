import Ably from "ably";
import dotenv from "dotenv";
import {
  handleAcceptRequest,
  handleBlockUser,
  handleRejectRequest,
  handleRemoveFriend,
  handleSendRequest,
  handleUnBlockUser,
  handleUserNotTyping,
  handleUserTyping,
} from "../controllers/users.controller";
import {
  handleDeleteMsg,
  handleEditMsg,
  handleNewMsg,
} from "../controllers/msg.controller";

dotenv.config(); //to read env files

const ably_key = process.env.ABLY; //ably api key

const ably_client = new Ably.Realtime.Promise(ably_key);

async function ably_endpoints() {
  let server_channel = ably_client.channels.get("server"); // it is the main channel that every client connects to in order to make realtime cooms.

  //when client sends request to another client
  server_channel.subscribe("send-request", (msg) => {
    let from = msg.data.from;
    let to = msg.data.to;
    let to_channel = ably_client.channels.get(to);
    handleSendRequest([from, to], to_channel);
  });

  //when client accepts the request
  server_channel.subscribe("accept-request", (msg) => {
    let from = msg.data.from;
    let to = msg.data.to;

    let chatId = msg.data.chatId;
    let from_channel = ably_client.channels.get(from);

    handleAcceptRequest([from, to, chatId], from_channel);
  });

  //when client rejects the request
  server_channel.subscribe("reject-request", (msg) => {
    let from = msg.data.from;
    let to = msg.data.to;
    let chatId = msg.data.chatId;
    let from_channel = ably_client.channels.get(from);

    handleRejectRequest([from, to, chatId], from_channel);
  });

  //when client  blocks the a user
  server_channel.subscribe("block-request", (msg) => {
    let from = msg.data.from;
    let to = msg.data.to;
    let from_channel = ably_client.channels.get(to);

    handleBlockUser([from, to], from_channel);
  });

  //when client  unblocks the a user
  server_channel.subscribe("unblock-request", (msg) => {
    let from = msg.data.from;
    let to = msg.data.to;
    let from_channel = ably_client.channels.get(to);

    handleUnBlockUser([from, to], from_channel);
  });

  //when client  removes  a user as a friend
  server_channel.subscribe("remove-request", (msg) => {
    let from = msg.data.from;
    let to = msg.data.to;
    let from_channel = ably_client.channels.get(to);

    handleRemoveFriend([from, to], from_channel);
  });

  server_channel.subscribe("new-msg", (data) => {
    let channel = ably_client.channels.get(data.data.to);
    let from_channel = ably_client.channels.get(data.data.from);

    handleNewMsg(data.data, channel, from_channel);
  });
  server_channel.subscribe("delete-msg", (data) => {
    let channel = ably_client.channels.get(data.data.to);

    handleDeleteMsg(data.data, channel);
  });
  server_channel.subscribe("edit-msg", (data) => {
    let channel = ably_client.channels.get(data.data.to);

    handleEditMsg(data.data, channel);
  });

  server_channel.subscribe("user-typing", (data) => {
    let channel = ably_client.channels.get(data.data.to);
    handleUserTyping(data, channel);
  });
  server_channel.subscribe("user-nottyping", (data) => {
    let channel = ably_client.channels.get(data.data.to);
    handleUserNotTyping(data, channel);
  });
}

export { ably_client, ably_endpoints };
