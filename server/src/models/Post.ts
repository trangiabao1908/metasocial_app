import mongoose, { ObjectId } from "mongoose";

import { IUser } from "./User";

export interface IPost {
  author: IUser;
  title: string;
  assets: [];
  video?: string;
  like?: mongoose.Types.DocumentArray<ILike>;
  comment?: mongoose.Types.DocumentArray<IComment>;
  disableComment: boolean;
}

interface IComment {
  user: IUser;
  comment: string;
  image: string;
  time: string;
  reply: mongoose.Types.DocumentArray<IReply>;
  _id: ObjectId;
}

interface ILike {
  user: IUser;
  isLike: boolean;
}

interface IReply {
  user: IUser;
  time: string;
  comment: string;
  tag: IUser;
  _id: ObjectId;
}

const postSchema = new mongoose.Schema<IPost>(
  {
    author: { type: mongoose.Schema.ObjectId, ref: "users" },
    title: { type: String },
    assets: [],
    like: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "users" },
        isLike: { type: Boolean, default: true },
      },
    ],
    comment: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "users" },
        comment: { type: String, required: false },
        image: { type: String, required: false },
        time: { type: String },
        reply: [
          {
            user: { type: mongoose.Types.ObjectId, ref: "users" },
            tag: { type: mongoose.Types.ObjectId, ref: "users" },
            comment: { type: String, required: false },
            time: { type: String },
            _id: { type: mongoose.Types.ObjectId },
          },
        ],
        _id: { type: mongoose.Types.ObjectId },
      },
    ],
    disableComment: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model<IPost>("posts", postSchema);

export const handlePost = {
  getAllPost: () =>
    Post.find()
      .populate("author")
      .populate({
        path: "author",
        select: "username picturePath",
      })
      .populate({ path: "comment", populate: { path: "user" } })
      .exec(),
  getPostByID: (id: string) =>
    Post.findById(id)
      .populate("author", ["username", "picturePath"])
      .sort({ updatedAt: "desc" })
      .exec(),
  getCommentPost: (id: string) =>
    Post.findById(id)
      .populate({ path: "comment.user", select: "username picturePath" })
      .populate({ path: "comment.reply.user", select: "username picturePath" })
      .populate({ path: "comment.reply.tag", select: "username _id" })
      .sort({ updatedAt: "desc" })
      .exec(),
  createPost: (value: Record<string, any>) => Post.create(value),
  updatePost: (id: {}, value: Record<string, any>, option: {}) =>
    Post.findOneAndUpdate(id, value, option),
  deletePost: (id: {}) => Post.findOneAndDelete(id),
};
