import express from "express";
import middlewareAuth from "../middlewares/middlewareAuth";
import notificationController from "../controllers/notificationController";

const router = express.Router();

// Get All User, Method: GET //
// api/user/getAllUser
router.get("/", middlewareAuth.verifyToken, notificationController.getNotice);

export default router;
