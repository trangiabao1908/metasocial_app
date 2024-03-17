import { Request, Response } from "express";
import { handlePost } from "../models/Post";
import { Post } from "../models/Post";
import User from "../models/User";
import { sessionsMap } from "../index";
const moment = require("moment");
const { ObjectId } = require("mongodb");
import { io } from "../index";

import {
  commentNotification,
  likeNotification,
  replyNotification,
} from "../utils/notifications";
import Notification from "../models/Notification";
// import User from "../models/User";

const postController = {
  // GET POST FOR LAZY LOADING
  getPosts: async (req: Request, res: Response) => {
    try {
      // const page = parseInt(req.query.page as string) || 1;
      const updatedAt = (req.query.updatedAt as string) || "";

      let query = {};
      if (updatedAt) {
        query = { updatedAt: { $lt: updatedAt } };
      }

      const limitPost = 10;

      const posts = await Post.find(query)
        .limit(limitPost + 1)
        .populate("author", ["username", "picturePath"])
        .sort({ updatedAt: "desc" })
        .exec();

      let isLastElement = false;
      if (posts.length <= limitPost) {
        isLastElement = true;
      }
      if (posts.length > limitPost) {
        posts.pop();
      }

      return res.status(200).json({
        success: true,
        message: "Get posts successfully",
        posts,
        isLastElement,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  //GET IMAGE ALL POST

  getImagePosts: async (req: Request, res: Response) => {
    try {
      // const page = parseInt(req.query.page as string) || 1;
      const updatedAt = (req.query.updatedAt as string) || "";

      let query = {};
      if (updatedAt) {
        query = { updatedAt: { $lt: updatedAt } };
      }
      const limitPost = 18;

      const posts = await Post.find(query)
        .limit(limitPost + 1)
        .populate({ path: "author", select: "_id" })
        .select("assets _id author updatedAt")
        .sort({ createdAt: "desc" })
        .exec();

      let isLastElement = false;
      if (posts.length <= limitPost) {
        isLastElement = true;
      }

      // Loại bỏ phần tử thêm vào để đảm bảo chỉ trả về limitPost bài đăng thực sự
      if (posts.length > limitPost) {
        posts.pop();
      }

      return res.status(200).json({
        success: true,
        message: "Get posts successfully",
        posts,
        isLastElement,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET ALL POST

  // Get post account logged in
  getPost: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const posts = await Post.find({ user: userId })
        .populate("user", ["username", "picturePath", "email"])
        .sort({ updatedAt: "desc" });
      return res
        .status(200)
        .json({ success: true, message: "Get Post Successfully", posts });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  // GET post By ID //
  getPostsByID: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const user = await User.findById(id);

      const posts = await Post.find({ author: id })
        .sort({ createdAt: -1 })
        .populate("author", ["_id", "username", "picturePath"]);

      // const idAuthor = posts[0].author._id.toString();

      // const user = await User.findById(idAuthor);

      return res.status(200).json({
        success: true,
        message: "Get Post By ID Successfully",
        data: posts,
        user: user,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  getPostPersonal: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(req.user.userId);
      const posts = await Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .populate("author", ["_id", "username", "picturePath"]);

      return res.status(200).json({
        success: true,
        message: "Get Post By ID Successfully",
        data: posts,
        user: user,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  // To create a new post //
  createPost: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const data = req.body;
      // console.log(data);

      const newPost = {
        author: userId,
        title: data.title,
        assets: data.assets,
        like: [],
        comment: [],
      };

      const post = await handlePost.createPost(newPost);
      const postID = post?._id.toString();
      const getPost = await handlePost.getPostByID(postID);

      return res.status(200).json({
        status: true,
        post: getPost,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // To update a post //
  updatePost: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      // const userId = req.user.userId;
      const updateCondition = {
        _id: id,
        author: userId,
      };

      const postImage = req.body;
      console.log(postImage);

      const postUpdate = await handlePost.updatePost(
        updateCondition,
        { title: postImage.title, assets: postImage.assets },
        { new: true }
      );

      if (postUpdate) {
        return res.status(200).json({
          status: true,
          postUpdate: postUpdate,
        });
      }
      return res.status(401).json({
        status: "Fail updating",
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  // TO delete a post by ID //
  deletePost: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;

      const deleteCondition = {
        _id: id,
        author: userId,
      };
      console.log("DELETE_POST");

      const postDeleted = await handlePost.deletePost(deleteCondition);

      //Delete Notifications
      await Notification.deleteMany({
        post: id,
      });

      if (postDeleted) {
        return res.status(200).json({
          status: true,
          postDeleted: postDeleted,
        });
      } else {
        return res.status(401).json({
          status: "Fail",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  // To like or dislike a post //
  likePost: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      let isLiked = false;
      let indexUpdate = 0;
      let type = true;
      const post = await handlePost.getPostByID(id);

      if (post !== null) {
        const receiverUserID = post?.author._id;

        const receiverSocketID = sessionsMap[receiverUserID];

        const userSend = await User.findById(userId).select(
          "username picturePath _id"
        );

        const userReceived = await User.findById(receiverUserID).select(
          "username picturePath _id"
        );

        post?.like?.map((data, index) => {
          if (data.user?.toString() === userId) {
            isLiked = true;
            indexUpdate = index;
          }
        });
        if (isLiked) {
          type = false;
          post.like?.splice(indexUpdate, 1);
        } else {
          const action = {
            sender: userSend,
            receiver: userReceived,
            type: "like",
            content: `${userSend?.username} đã thích bài viết của bạn.`,
            post: post,
          };
          if (
            userSend &&
            userReceived &&
            userSend._id.toString() !== userReceived._id.toString()
          ) {
            likeNotification(action);
          }

          type = true;
          post?.like?.push({ user: userId });
          io.to(receiverSocketID).emit("notification", {
            action: action,
          });
        }
        post?.save();
      }

      if (type) {
        return res.status(200).json({
          status: true,
          post: post?.like,
          postID: post?._id,
          type: type,
          indexUpdate: indexUpdate,
        });
      } else {
        return res.status(200).json({
          status: true,
          post: null,
          type: type,
          indexUpdate: indexUpdate,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  getCommentPost: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // let totalComment = 0;

      // const user = await handleUser.getUserByID(userId);
      const post = await handlePost.getCommentPost(id);

      const comment = post?.comment?.map((_item, index, array) => {
        return array[array.length - 1 - index];
      });

      return res.status(200).json({
        status: true,
        // totalComment: totalComment,
        data: comment,
        post: post,
      });

      // console.log(comment?.length);
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  commentPost: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { comment } = req.body;
      const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
      const objectId = new ObjectId();

      const userSender = await User.findById(userId).select(
        "username picturePath _id"
      );
      const post = await handlePost.getPostByID(id);
      if (!post?.disableComment) {
        const userReceiver = await User.findById(post?.author._id).select(
          "username picturePath _id"
        );

        const receiverSocketID = sessionsMap[userReceiver?._id];

        if (
          userSender &&
          userReceiver &&
          userReceiver._id.toString() !== userSender._id.toString()
        ) {
          const action = {
            sender: userSender,
            receiver: userReceiver,
            type: "comment",
            content: `${userSender?.username} đã bình luận về bài viết của bạn`,
            post: post,
          };
          console.log({ action });

          commentNotification(action);
          io.to(receiverSocketID).emit("notification", {
            action: action,
          });
        }

        if (comment) {
          post?.comment?.push({
            user: userId,
            comment: comment,
            time: currentTime,
            reply: [],
            _id: objectId,
          });
        }
        post?.save();
        return res.status(200).json({
          status: true,
          data: post,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Người đăng đã tắt chức năng bình luận",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  updateComment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const query = req.query["id"];
      const contentUpdate = req.body;

      const post = await handlePost.getPostByID(id);
      if (post !== null) {
        post.comment?.map((item) => {
          if (
            userId === item.user.toString() &&
            query === item._id?.toString()
          ) {
            item.comment = contentUpdate.comment;
          }
        });
        post.save();
      }
      return res.status(200).json({
        status: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  deleteComment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const query = req.query["id"];

      let indexCommentToDelete = 0;

      const post = await handlePost.getPostByID(id);
      console.log({ query: query, id: id });

      if (post !== null) {
        post.comment?.map((item, index) => {
          if (
            userId === item.user.toString() &&
            query === item._id?.toString()
          ) {
            indexCommentToDelete = index;
          }
        });
        post.comment?.splice(indexCommentToDelete, 1);
        post.save();
      }

      return res.status(200).json({
        status: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  replyComment: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      const commentID = req.query["commentID"] as string;
      const objectId = new ObjectId();
      const { comment, tag } = req.body;
      const post = await handlePost.getPostByID(id);
      if (!post?.disableComment) {
        const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
        const user = await User.findById(userId).select(
          "username picturePath _id"
        );
        const tagUser = await User.findById(tag).select(
          "username picturePath _id"
        );
        const receiverSocketID = sessionsMap[tagUser?._id];
        if (tagUser && user && user._id.toString() !== tagUser._id.toString()) {
          const action = {
            sender: user,
            receiver: tagUser,
            type: "reply",
            content: `${user?.username} đã trả lời bình luận của bạn.`,
            post: post,
          };
          replyNotification(action);
          io.to(receiverSocketID).emit("notification", {
            action: action,
          });
        }

        let dataComment = {
          comment: comment,
          time: currentTime,
          _id: objectId,
          user: user,
          tag: tagUser,
        };

        post?.comment?.map((item) => {
          if (item._id.toString() === commentID) {
            item.reply?.push(dataComment);
          }
        });
        post?.save();

        return res.status(200).json({
          status: true,
          data: post,
          tagUser: tagUser,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Người đăng đã tắt chức năng bình luận",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },
  deleteReplyComment: async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.userId;
    const commentID = req.query["commentID"] as string;
    const replyID = req.query["replyID"] as string;

    let indexCommentToDelete = 0;

    let indexComment = 0;
    const post = await handlePost.getPostByID(id);

    if (post !== null) {
      post.comment?.map((item, indexCmt) => {
        if (item._id.toString() === commentID) {
          item.reply.map((cmt, index) => {
            if (
              cmt.user._id.toString() === userId &&
              cmt._id.toString() === replyID
            ) {
              indexCommentToDelete = index;
              indexComment = indexCmt;
            }
          });
        }
      });
    }

    if (post?.comment) {
      post.comment[indexComment].reply?.splice(indexCommentToDelete, 1);
      post.save();
    }

    return res.status(200).json({
      status: true,
      data: post?.comment,
    });
  },

  updateReplyComment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const cmtID = req.query["cmtID"];
      const replyID = req.query["replyID"];

      const { comment } = req.body;

      const post = await handlePost.getPostByID(id);
      if (post !== null) {
        post.comment?.forEach((item) => {
          if (item._id.toString() === cmtID) {
            item.reply?.forEach((rep) => {
              if (
                userId === rep.user._id.toString() &&
                replyID === rep._id.toString()
              ) {
                rep.comment = comment;
              }
            });
          }
        });
        post.save();
      }
      return res.status(200).json({
        status: true,
        data: post,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },
  hideComment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      const { disableComment } = req.body;

      const post = await handlePost.getPostByID(id);

      if (!post) {
        return res.status(404).json({
          status: false,
          message: "Bài đăng không tồn tại",
        });
      }
      console.log({ author: post?.author._id, user: userId });

      if (post?.author._id.toString() === userId) {
        const updatedPost = await Post.findByIdAndUpdate(
          id,
          { disableComment: disableComment },
          { new: true }
        );

        return res.status(200).json({
          status: true,
          data: updatedPost,
          disableComment: disableComment,
        });
      }

      return res.status(403).json({
        status: false,
        message: "Bạn không có quyền cập nhật bài đăng này",
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },

  getLikeList: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      // const userId = req.user.userId;

      // const user = await User.findById(userId).select(
      //   "sentFriendRequests friendRequests"
      // );

      const list = await Post.findById(id).select("_id author like").populate({
        path: "like.user",
        select: "username _id picturePath displayName",
      });
      // .select("_id author like");
      // console.log(list);

      return res.status(200).json({
        status: true,
        list: list?.like,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },
  searchUserLike: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const searchQuery: string | undefined =
        typeof req.query["q"] === "string" ? req.query["q"] : undefined;

      if (searchQuery) {
        const search = await Post.findById(id)
          .populate({
            path: "like.user",
            match: {
              username: { $exists: true, $regex: searchQuery, $options: "i" },
            },
            select: "_id username picturePath",
          })
          .exec();
        const results = search?.like?.filter((item) => item.user !== null);

        return res.status(200).json({
          status: true,
          results: results,
        });
      } else {
        return res.status(200).json({
          status: true,
          message: "Không tìm thấy người dùng.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  },
};

export default postController;
