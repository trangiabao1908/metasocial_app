import express from "express";
import middlewareAuth from "../middlewares/middlewareAuth";
import bookmarkController from "../controllers/bookmarkController";

const router = express.Router();

// Get All User, Method: GET //
// api/user/getAllUser
router.get("/", middlewareAuth.verifyToken, bookmarkController.getBookmarks);

router.post(
  "/create",
  middlewareAuth.verifyToken,
  bookmarkController.createBookmark
);

router.delete(
  "/delete/:id",
  middlewareAuth.verifyToken,
  bookmarkController.deleteBookmark
);

export default router;
