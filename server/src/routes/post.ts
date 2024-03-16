import express from "express";
import postController from "../controllers/postController";
import middlewareAuth from "../middlewares/middlewareAuth";
// import { upload } from "../utils/storage";

const router = express.Router();

// CREATE POST, method: POST //
// router.post("/", middlewareAuth.verifyToken, postController.createPost);

// get all post
// router.get('/', verifyToken, postController.getAllPost);
router.get("/", middlewareAuth.verifyToken, postController.getPosts);
// router.get("/", postController.getPosts);

// Get image posts

router.get("/images", middlewareAuth.verifyToken, postController.getImagePosts);

// get post by id
router.get("/:id", middlewareAuth.verifyToken, postController.getPostsByID);

router.get(
  "/view/:id",
  middlewareAuth.verifyToken,
  postController.getPostPersonal
);

// create post
// router.post('/create', [verifyToken, upload.array('postImg', 3)], postController.create);
router.post("/create", middlewareAuth.verifyToken, postController.createPost);

// update post
// router.put('/update/:id', [verifyToken, upload.array('postImg', 3)], postController.updatePost);
router.put(
  "/update/:id",
  middlewareAuth.verifyToken,
  postController.updatePost
);

// delete post
// router.delete('/delete/:id', verifyToken, postController.deletePost);
router.delete(
  "/delete/:id",
  middlewareAuth.verifyToken,
  postController.deletePost
);

// like post
router.put("/like/:id", middlewareAuth.verifyToken, postController.likePost);

// comment post
router.post(
  "/comment/:id",
  middlewareAuth.verifyToken,
  postController.commentPost
);

// get comment post by ID
router.get(
  "/comment/get/:id",
  middlewareAuth.verifyToken,
  postController.getCommentPost
);

// update comment
router.put(
  "/comment/update/:id",
  middlewareAuth.verifyToken,
  postController.updateComment
);

// delete comment
router.delete(
  "/comment/delete/:id",
  middlewareAuth.verifyToken,
  postController.deleteComment
);

// reply comment
router.post(
  "/comment/reply/:id",
  middlewareAuth.verifyToken,
  postController.replyComment
);

// delete reply comment
router.delete(
  "/comment/reply/delete/:id",
  middlewareAuth.verifyToken,
  postController.deleteReplyComment
);

// update reply comment
router.put(
  "/comment/reply/update/:id",
  middlewareAuth.verifyToken,
  postController.updateReplyComment
);

// hide comment
router.put(
  "/comment/hide/:id",
  middlewareAuth.verifyToken,
  postController.hideComment
);

// get like list
router.get(
  "/like/list/:id",
  middlewareAuth.verifyToken,
  postController.getLikeList
);

export default router;
