import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";
import { IPost } from "./Post";
export interface INotification extends Document {
  sender: IUser;
  receiver: IUser;
  type:
    | "like"
    | "comment"
    | "post"
    | "reply"
    | "requestFriend"
    | "acceptFriend";
  content: string;
  post: IPost;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "like",
        "comment",
        "post",
        "reply",
        "requestFriend",
        "acceptFriend",
      ],
    },
    content: {
      type: String,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("notifications", notificationSchema);
export default Notification;
