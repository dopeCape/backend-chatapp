import { Schema } from "mongoose";

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
  },
  groupChats: [
    {
      groupId: String,
    },
  ],

  friends: [
    {
      userId: String,
      userName: String,
      profilePic: String,
      chatId: String,
      blocked: String,
      pending: String,
    },
  ],
  requests: [
    {
      userId: String,
      userName: String,
      profilePic: String,

      chatId: String,
      pending: String,
    },
  ],
});

export { userSchema };
