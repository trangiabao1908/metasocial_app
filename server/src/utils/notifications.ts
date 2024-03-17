import Notification from "../models/Notification";

export const likeNotification = async (action: any) => {
  const { sender, post } = action;

  const existingNotification = await Notification.findOne({
    sender: sender._id,
    post: post._id,
  });
  if (!existingNotification) {
    await Notification.create(action);
  }
};

export const commentNotification = async (action: any) => {
  await Notification.create(action);
};

export const replyNotification = async (action: any) => {
  await Notification.create(action);
};

export const requestFriendNotification = async (action: any) => {
  await Notification.create(action);
};

export const acceptFriendNotification = async (action: any) => {
  await Notification.create(action);
};
