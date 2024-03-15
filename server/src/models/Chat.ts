import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IMessage } from "./Message";
export interface IChat extends Document {
  participants: {
    senderId: IUser;
    receiverId: IUser;
  };
  messages: IMessage[];
}

const chatSchema = new Schema<IChat>(
  {
    participants: {
      senderId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      receiverId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
