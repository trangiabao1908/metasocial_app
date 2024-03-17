import express from "express";
import middlewareAuth from "../middlewares/middlewareAuth";
import userController from "../controllers/userController";
const router = express.Router();

// Get All User, Method: GET //
// api/user/getAllUser
router.get(
  "/getAllUser",
  middlewareAuth.verifyToken,
  userController.getAllUser
);
// Update User
// api/user/update
router.put("/update", middlewareAuth.verifyToken, userController.updateUser);

// FETCH MESSAGE
router.get("/message", middlewareAuth.verifyToken, userController.fetchMessage);

// FETCH CHAT //
router.get("/chat", middlewareAuth.verifyToken, userController.fetchChat);
// GET USER FRIENDS
router.get(
  "/friends",
  middlewareAuth.verifyToken,
  userController.getUserFriend
);
// SEND REQUEST TO ADD FRIEND //
router.post(
  "/friend-request",
  middlewareAuth.verifyToken,
  userController.requestFriends
);
router.put(
  "/unfriend-request",
  middlewareAuth.verifyToken,
  userController.removeFriend
);
// GET FRIEND REQUEST, method: GET//
router.get(
  "/friend-request/:userId",
  middlewareAuth.verifyToken,
  userController.getRequestFriends
);
// GET SENT FRIEND REQUEST, method: GET//
router.get(
  "/sent-friend-request",
  middlewareAuth.verifyToken,
  userController.getSendRequestFriend
);

// GET CHAT ID//
router.get("/chatId", middlewareAuth.verifyToken, userController.getIdChat);

//ACCEPT FRIEND REQUEST, method: PUT//
router.put(
  "/friend-request/accept",
  middlewareAuth.verifyToken,
  userController.acceptFriendRequest
);

// SEND MESSAGE //
router.post("/message", middlewareAuth.verifyToken, userController.sendMessage);

// DELETE MESSAGE //
router.post(
  "/deleteMessage",
  middlewareAuth.verifyToken,
  userController.deleteMessage
);

// Search User
router.get("/search", middlewareAuth.verifyToken, userController.findUser);

export default router;
