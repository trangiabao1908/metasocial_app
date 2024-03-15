import { Request, Response } from "express";
import Notification from "..//models/Notification";

const notificationController = {
  getNotice: async (req: Request, res: Response) => {
    const userId = req.user.userId;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const noticesToday = await Notification.find({
      receiver: userId,
      createdAt: {
        $gte: new Date(today.setHours(0, 0, 0, 0)),
        $lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    })
      .populate({
        path: "sender",
        select: "username _id picturePath",
      })
      .populate({ path: "post", select: "_id assets " });

    const noticesIn7Days = await Notification.find({
      receiver: userId,
      createdAt: {
        $lt: new Date(today.setHours(0, 0, 0, 0)),
        $gte: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)),
      },
    })
      .populate({
        path: "sender",
        select: "username _id picturePath",
      })
      .populate({ path: "post", select: "_id assets " });

    const noticesIn30Days = await Notification.find({
      receiver: userId,
      createdAt: {
        $lt: new Date(sevenDaysAgo.setHours(0, 0, 0, 0)),
        $gte: new Date(thirtyDaysAgo.setHours(0, 0, 0, 0)),
      },
    })
      .populate({
        path: "sender",
        select: "username _id picturePath",
      })
      .populate({ path: "post", select: "_id assets " });

    return res.status(200).json({
      noticesToday: noticesToday,
      noticesIn7Days: noticesIn7Days,
      noticesIn30Days: noticesIn30Days,
    });
  },
};

export default notificationController;
