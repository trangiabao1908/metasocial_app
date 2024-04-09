import mongoose from "mongoose";

import { IUser } from "./User";
import { IPost } from "./Post";

export interface IBookMark {
  author: IUser;
  post: IPost;
}

const postSchema = new mongoose.Schema<IBookMark>(
  {
    post: { type: mongoose.Schema.ObjectId, ref: "posts" },
    author: { type: mongoose.Schema.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

export const Bookmark = mongoose.model<IBookMark>("bookmarks", postSchema);
