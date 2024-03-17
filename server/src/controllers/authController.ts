import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import argon2 from "argon2";
import User from "../models/User";
import { createToken } from "../utils/auth";
import { AuthPayload } from "../types/AuthPayload";
import TokenModel from "../models/Token";
const nodemailer = require("nodemailer");
dotenv.config();
// export let refreshTokens: string[] = [];
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USERNAME as Secret,
    pass: process.env.GMAIL_PASSWORD as Secret,
  },
});
const authController = {
  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email: email }).populate({
        path: "friends",
        select: ["username", "email", "picturePath"],
        options: { sort: { updatedAt: -1 } },
      });
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: "Sai email !!!" });
      }
      const isValidPassWord = await argon2.verify(
        existingUser.password,
        password
      );
      if (!isValidPassWord) {
        return res.status(404).json({
          success: false,
          message: "Sai mật khẩu !!!",
        });
      }
      /// Call function to create refreshToken for website
      // createCookie(res, existingUser, refreshTokens);

      const { password: existingPassword, ...userWithoutPassword } =
        existingUser;
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        user: userWithoutPassword._doc,
        accessToken: createToken("access_token", existingUser),
        refreshToken: createToken("refresh_token", existingUser),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  //function to  change Pass //
  changePassword: async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword, confirmNewPassword } = req.body;
      const userLoggedId = req.user.userId;
      const user = await User.findById(userLoggedId);
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Người dùng không tồn tại" });
      }
      const oldPassword = user?.password;
      const isValidPassword = await argon2.verify(oldPassword, currentPassword);
      console.log(isValidPassword);
      if (!isValidPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu hiện tại không đúng!" });
      }
      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu không khớp" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu tối thiểu phải có 6 ký tự",
        });
      }
      const hashedNewPassword = await argon2.hash(newPassword);
      user.password = hashedNewPassword;
      await user.save();
      return res
        .status(201)
        .json({ success: true, message: "Thay đổi mật khẩu thành công" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Người dùng không tồn tại!" });
      }
      function generateOTP(length: number): string {
        return [...Array(length)]
          .map(() => Math.floor(Math.random() * 10))
          .join("");
      }
      const otp = generateOTP(6);
      const token = new TokenModel({ email: user.email, token: otp });
      await token.save();
      const mailOptions = {
        from: {
          name: "MetaSocial App",
          address: "baotran40262@gmail.com",
        },
        to: email,
        subject: "Email Reset Mật Khẩu",
        text: `Đây là mã reset password của bạn: ${otp}. Hãy điền nó để tiếp tục tạo lại mật khẩu`,
      };
      transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
        if (error) {
          console.log(error);
          return res.status(400).json({
            success: false,
            message: "Gửi email thay đổi mật khẩu thất bại!!!",
          });
        } else {
          console.log("Email sent: " + info.response);
          return res.status(200).json({
            success: true,
            message: "Email tạo mới mật khẩu được gửi thành công",
          });
        }
      });
      return true;
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword, confirmNewPassword, email } = req.body;
      console.log(token);
      const findToken = await TokenModel.findOne({ email, token });
      if (!findToken) {
        return res
          .status(400)
          .json({ success: false, message: "Mã token không tồn tại" });
      }
      const user = await User.findOne({ email: email });
      if (newPassword !== confirmNewPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Mật khẩu không khớp" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Mật khẩu tối thiểu phải có 6 ký tự",
        });
      }
      const hashPassword = await argon2.hash(newPassword);
      if (user) {
        user.password = hashPassword;
        await user.save();
        // await token.remove();
      }
      await findToken.deleteOne();
      return res
        .status(200)
        .json({ success: true, message: "Tạo mới mật khẩu thành công" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err });
    }
  },
  // register a user
  register: async (req: Request, res: Response) => {
    const { username, email, password, confirmpassword } = req.body;
    try {
      if (!email || !password) {
        return res.status(403).json({
          success: false,
          message: "Vui lòng nhập email hoặc mật khẩu.",
        });
      }
      const existingUsername = await User.findOne({ username: username });
      if (existingUsername) {
        return res
          .status(400)
          .json({ success: false, message: "Tên người dùng đã tồn tại!" });
      }
      const existingUser = await User.findOne({
        email: email,
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email này đã tồn tại!" });
      }
      if (password != confirmpassword) {
        return res.status(403).json({
          success: false,
          message: "Mật khẩu không khớp",
        });
      }
      if (password.length < 6) {
        return res.status(403).json({
          success: false,
          message: "Mật khẩu tối thiểu phải có 6 ký tự",
        });
      }
      const hashPassword = await argon2.hash(password);
      const newUser = new User({
        username,
        email,
        password: hashPassword,
        picturePath:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png",
        isAdmin: false,
      });
      const savedUser = await newUser.save();
      // const { ...others, password } = savedUser._doc;
      return res.status(201).json({
        success: true,
        message: "Registration successful",
        user: savedUser,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  // register: async (req: Request, res: Response) => {
  //   const {
  //     username,
  //     email,
  //     password,
  //     picturePath,
  //     friends,
  //     location,
  //     occupation,
  //   } = req.body;
  //   try {
  //     console.log("req.file:", req.file);
  //     if (!email || !password) {
  //       return res.status(403).json({
  //         success: false,
  //         message: "Please enter your email or password.",
  //       });
  //     }
  //     const existingUser = await User.findOne({ email: email });
  //     if (existingUser) {
  //       return res
  //         .status(400)
  //         .json({ success: false, message: "User already exists" });
  //     }
  //     const hashPassword = await argon2.hash(password);
  //     const newUser = new User({
  //       username,
  //       email,
  //       password: hashPassword,
  //       picturePath,
  //       friends,
  //       location,
  //       occupation,
  //       viewedProfile: Math.floor(Math.random() * 10000),
  //       impressions: Math.floor(Math.random() * 10000),
  //       isAdmin: false,
  //     });
  //     const savedUser = await newUser.save();
  //     // const { ...others, password } = savedUser._doc;
  //     return res.status(201).json({
  //       success: true,
  //       message: "Registration successful",
  //       newUser: savedUser,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ success: false, message: error.message });
  //   }
  // },

  // function to refreshToken for web
  // refreshToken: async (req: Request, res: Response) => {
  //   const refreshToken = req.cookies[process.env.REFRESH_TOKEN_NAME as string];
  //   if (!refreshToken) {
  //     return res.sendStatus(401);
  //   }
  //   if (!refreshTokens.includes(refreshToken)) {
  //     return res.status(403).json("Refresh token is not available");
  //   }
  //   try {
  //     const decoded = jwt.verify(
  //       refreshToken,
  //       process.env.REFRESHTOKEN_SECRET as Secret
  //     ) as AuthPayload;
  //     const existingUser = await User.findById(decoded.userId);
  //     if (!existingUser) {
  //       return res.sendStatus(401);
  //     }
  //     refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  //     createCookie(res, existingUser, refreshTokens);
  //     return res.status(200).json({
  //       success: true,
  //       message: "Refresh Token Successfully",
  //       accessToken: createToken("access_token", existingUser),
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //     return res.sendStatus(403);
  //   }
  // },

  //function to refreshToken for mobile devices
  refreshTokenMobile: async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401);
    }
    // if (!refreshTokens.includes(refreshToken)) {
    //   return res.status(403).json("Refresh token is not available");
    // }
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESHTOKEN_SECRET as Secret
      ) as AuthPayload;
      const existingUser = await User.findById(decoded.userId);
      if (!existingUser) {
        return res.sendStatus(401);
      }
      // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      return res.status(200).json({
        success: true,
        message: "Refresh Token Successfully",
        accessToken: createToken("access_token", existingUser),
        refreshToken: createToken("refresh_token", existingUser),
      });
    } catch (err) {
      console.log(err.message);
      return res.status(403);
    }
  },

  // function to logout
  logout: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const existingUSer = await User.findById(userId);
      if (!existingUSer) {
        return res
          .status(400)
          .json({ success: false, message: "You are not logged in" });
      }
      // res.clearCookie(process.env.REFRESH_TOKEN_NAME as string, {
      //   httpOnly: true,
      //   sameSite: "lax",
      //   secure: true,
      //   path: "/api/auth/refresh_token",
      // });
      return res
        .status(200)
        .json({ success: true, message: "Đăng xuất thành công" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default authController;
