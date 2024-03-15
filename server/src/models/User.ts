import mongoose, { Schema, Document } from "mongoose";

interface DocumentResult<T> {
  _doc: T;
}
export interface IUser extends DocumentResult<Event>, Document {
  // _id: mongoose.Types.ObjectId;
  displayName: string;
  story: string;
  link: string;
  username: string;
  email: string;
  password: string;
  friends?: IUser[];
  friendRequests?: IUser[];
  sentFriendRequests?: IUser[];
  picturePath: string;
  location?: string;
  occupation?: string;
  followers: number;
  impressions: number;
  isAdmin: boolean;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      index: "text",
      required: true,
      max: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      default: "",
    },
    story: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    friendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    sentFriendRequests: [
      {
        type: Schema.Types.ObjectId,
        ref: "users",
      },
    ],

    picturePath: {
      type: String,
      default: "",
    },
    location: String,
    occupation: String,
    impressions: Number,
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>("users", UserSchema);

export default User;
