import { Request, Response } from "express";
import { Bookmark } from "../models/Bookmark";

const bookmarkController = {
  getBookmarks: async (req: Request, res: Response) => {
    const userID = req.user?.userId;

    const listBookmarks = await Bookmark.find({ author: userID })
      .populate({
        path: "author",
        select: "_id",
      })
      .populate({
        path: "post",
        select: "_id assets author",
      });

    return res.status(200).json({
      bookmarks: listBookmarks,
      status: true,
    });
  },
  createBookmark: async (req: Request, res: Response) => {
    const userID = req.user?.userId;
    const { postID } = req.body;

    const newBookmark = await Bookmark.create({ author: userID, post: postID });

    await newBookmark.populate({
      path: "author",
      select: "_id",
    });
    await newBookmark.populate({
      path: "post",
      select: "_id assets author",
    });

    return res.status(200).json({
      user: userID,
      postID: postID,
      newBookmark: newBookmark,
      status: true,
    });
  },
  deleteBookmark: async (req: Request, res: Response) => {
    const userID = req.user?.userId;
    const postID = req.params["id"];

    await Bookmark.deleteOne({
      author: userID,
      post: postID,
    });

    return res.status(200).json({
      user: userID,
      postID: postID,
      status: true,
    });
  },
};

export default bookmarkController;
