import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
export interface IMessage extends Document {
  senderId: IUser;
  receiverId: IUser;
  messageType: "text" | "image";
  message: string;
  imageUrl?: string;
}
const messageSchema = new Schema<IMessage>(
  {
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
    messageType: {
      type: String,
      enum: ["text", "image"],
      required: true,
    },
    message: {
      type: String,
    },
    imageUrl: String,
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", messageSchema);
export default Message;
