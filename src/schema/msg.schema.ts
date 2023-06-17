import { Schema } from "mongoose";

const msgSchema = new Schema({
  chatId: String,
  msges: [
    {
      msgId: String,
      from: String,
      msg: String,
      date: String,
      edited: Boolean,
    },
  ],
});

export { msgSchema };
