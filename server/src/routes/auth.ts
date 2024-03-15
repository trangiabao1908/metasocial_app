import express from "express";
import authController from "../controllers/authController";
import middlewareAuth from "../middlewares/middlewareAuth";
const router = express.Router();
// import { upload } from "../utils/storage";

//register
// router.post("/register", upload.single("picture"), authController.register);
router.post("/register", authController.register);

//login
router.post("/login", authController.login);

// refresh Token
router.post("/refresh_token", authController.refreshTokenMobile);
// router.get("/refresh_token", authController.refreshToken);
// Change Password
router.post(
  "/change_password",
  middlewareAuth.verifyToken,
  authController.changePassword
);

router.post("/forgot_password", authController.forgotPassword);
router.post("/reset_password", authController.resetPassword);
//logout
router.get("/logout", middlewareAuth.verifyToken, authController.logout);
export default router;
