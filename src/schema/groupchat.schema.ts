import { Schema } from "mongoose";

const groupChatSchema = new Schema({
  groupId: {
    required: true,
    type: String,
  },
  groupName: String,
  chatId: String,
  createdOn: String,
  Members: [
    {
      userName: String,
      userId: String,
      profilePic: String,
    },
  ],
  groupAdmin: String,
});

export { groupChatSchema };
