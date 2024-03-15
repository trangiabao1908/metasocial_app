import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { AuthPayload } from "../types/AuthPayload";

const middlewareAuth = {
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header("Authorization");
      const accesstoken = token && token.split(" ")[1];
      if (!accesstoken) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
      const decoded = jwt.verify(
        accesstoken,
        process.env.ACCESSTOKEN_SECRET as Secret
      ) as AuthPayload;
      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

export default middlewareAuth;
