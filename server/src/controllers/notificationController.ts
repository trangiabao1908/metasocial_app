import { Request, Response } from "express";
import Notification from "..//models/Notification";

const notificationController = {
  getNotice: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const updatedAt = (req.query.updatedAt as string) || "";
      console.log("updatedAt: ", updatedAt);
      let query = {};
      if (updatedAt) {
        query = { updatedAt: { $lt: updatedAt } };
      }
      const limitNotice = 10;
      console.log(query);
      const notices = await Notification.find({
        receiver: userId,
        ...query,
      })
        .limit(limitNotice + 1)
        .populate({
          path: "sender",
          select: "username _id picturePath",
        })
        .populate({ path: "post", select: "_id assets author" })
        .sort({ updatedAt: "desc" })
        .exec();

      let isLastElement = false;
      if (notices.length <= limitNotice) {
        isLastElement = true;
      }
      if (notices.length > limitNotice) {
        notices.pop();
      }

      return res.status(200).json({
        noticesToday: notices,
        isLastElement: isLastElement,
      });
    } catch (err) {
      return res.status(500).json({ message: "Something went wrong!" });
    }
  },
};

export default notificationController;
