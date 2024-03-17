import { Request, Response } from "express";
import { io, sessionsMap } from "../index";
import { Chat } from "../models/Chat";
import Message from "../models/Message";
import User from "../models/User";
import { decryptMessage, encryptMessage } from "../utils/processMessage";

const userController = {
  // Get All User //
  getAllUser: async (_req: Request, res: Response) => {
    try {
      const users = await User.find().select("-password");
      if (!users) {
        return res
          .status(400)
          .json({ success: false, message: "Get all user failed" });
      }
      return res.status(200).json({
        success: true,
        message: "Get all user successfully",
        users: users,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET USER BY ID //
  getUser: async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      console.log(userId);
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({
        success: true,
        message: "Get User By ID Successfully",
        user: user,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const data = req.body;

      const user = await User.findById(userId).select("username");

      if (user?.username === data.values.username) {
        const updatedData = {
          picturePath: data.url,
          displayName: data.values.displayName,
          story: data.values.story,
          link: data.values.link,
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
          new: true,
        });

        await updatedUser?.save();
        return res.status(200).json({
          success: true,
          message: "Update Successfully",
          user: updatedUser,
        });
      } else {
        const existUsername = await User.findOne({
          username: data.values.username,
        });
        if (existUsername) {
          return res.status(400).json({
            message: "Tên người dùng này đã tồn tại!",
          });
        } else {
          const updatedData = {
            picturePath: data.url,
            username: data.values.username,
            displayName: data.values.displayName,
            story: data.values.story,
            link: data.values.link,
          };

          const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedData,
            {
              new: true,
            }
          );

          await updatedUser?.save();
          return res.status(200).json({
            success: true,
            message: "Update Successfully",
            user: updatedUser,
          });
        }
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  requestFriends: async (req: Request, res: Response) => {
    const userIdLogged = req.user.userId;
    const { selectedUserId } = req.body;
    const userLogged = await User.findById(userIdLogged);
    const selectedUser = await User.findById(selectedUserId);
    if (!userLogged || !selectedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Người dùng không tồn tại" });
    }
    try {
      if (userLogged!.sentFriendRequests?.includes(selectedUserId)) {
        userLogged.sentFriendRequests = userLogged?.sentFriendRequests?.filter(
          (friend) => {
            friend.toString() !== selectedUserId.toString();
          }
        );

        selectedUser.friendRequests = selectedUser?.friendRequests?.filter(
          (friend) => {
            friend.toString() !== userIdLogged.toString();
          }
        );
        await userLogged.save();
        await selectedUser.save();
        return res.status(200).json({
          success: true,
          message: "Hủy yêu cầu thêm bạn thành công",
          type: "remove",
        });
      } else {
        await User.findByIdAndUpdate(
          selectedUserId,
          { $push: { friendRequests: userIdLogged } },
          { new: true }
        );
        await User.findByIdAndUpdate(
          userIdLogged,
          { $push: { sentFriendRequests: selectedUserId } },
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "Gửi yêu cầu thêm bạn thành công",
          type: "add",
        });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET REQUEST FRIEND BY ID //
  getRequestFriends: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId)
        .populate("friendRequests", ["username", "email", "picturePath"])
        .lean();

      const friendRequests = user?.friendRequests;
      return res.status(200).json({
        success: true,
        message: "Get Friends Request Successfully",
        friendRequests,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  getSendRequestFriend: async (req: Request, res: Response) => {
    try {
      const userId = req.query.selectedUserId;
      const user = await User.findById(userId).populate("sentFriendRequests", [
        "username",
        "_id",
        "email",
        "picturePath",
      ]);
      const requestFriend = user?.sentFriendRequests;
      return res.status(200).json({
        success: true,
        message: "Get Sent Request Friend Successfully!",
        data: requestFriend,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  // ACCEPT FRIEND REQUEST //
  acceptFriendRequest: async (req: Request, res: Response) => {
    try {
      const userIDLogged = req.user.userId;
      const acceptFriendId = req.body.needAcceptId;
      const userLogged = await User.findById(userIDLogged);
      const NeedacceptFriend = await User.findById(acceptFriendId);
      userLogged?.friends?.push(NeedacceptFriend?._id);
      NeedacceptFriend?.friends?.push(userLogged?._id);
      console.log(acceptFriendId.toString());

      userLogged!.friendRequests = userLogged?.friendRequests?.filter(
        (friend) => friend.toString() !== acceptFriendId
      );
      NeedacceptFriend!.sentFriendRequests =
        NeedacceptFriend?.sentFriendRequests?.filter(
          (friend) => friend.toString() !== userIDLogged.toString()
        );
      await userLogged?.save();
      await NeedacceptFriend?.save();
      const NeedacceptFriendFormatted = {
        _id: NeedacceptFriend?._id,
        username: NeedacceptFriend?.username,
        picturePath: NeedacceptFriend?.picturePath || "",
        email: NeedacceptFriend?.email,
      };

      if (acceptFriendId) {
        const socketFriendID = acceptFriendId
          ? sessionsMap[acceptFriendId]
          : acceptFriendId;
        io.to(socketFriendID).emit("setFriend", acceptFriendId);
      }

      return res.status(200).json({
        success: true,
        message: "Xác nhận kết bạn thành công",
        data: NeedacceptFriendFormatted,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // SEND A MESSAGE FOR USER //
  sendMessage: async (req: Request, res: Response) => {
    try {
      const senderId = req.user.userId;
      const { receiverId, message, messageType, imageUrl } = req.body;
      console.log(receiverId);
      const receiverSocketId = receiverId
        ? sessionsMap[receiverId.toString()]
        : receiverId;
      console.log(receiverSocketId);
      let chat = await Chat.findOne({
        $or: [
          {
            "participants.senderId": senderId,
            "participants.receiverId": receiverId,
          },
          {
            "participants.senderId": receiverId,
            "participants.receiverId": senderId,
          },
        ],
      });
      if (!chat) {
        chat = await Chat.create({
          participants: { senderId: senderId, receiverId: receiverId },
        });
      }
      const newMessage = new Message({
        senderId,
        receiverId,
        messageType,
        message: message ? encryptMessage(message) : "",
        timestamp: new Date(),
        imageUrl: messageType === "image" ? encryptMessage(imageUrl) : null,
      });
      if (newMessage) {
        chat.messages.push(newMessage._id);
      }
      await Promise.all([newMessage.save(), chat.save()]);

      const newMessageFormatted = await Message.findById(newMessage._id)
        .populate("senderId", ["username", "_id"])
        .populate("receiverId", ["username", "_id"]);
      if (newMessageFormatted) {
        if (newMessageFormatted.messageType === "text") {
          newMessageFormatted.message = decryptMessage(
            newMessageFormatted.message
          );
        } else if (
          newMessageFormatted.imageUrl &&
          newMessageFormatted.messageType === "image"
        ) {
          newMessageFormatted.imageUrl = decryptMessage(
            newMessageFormatted.imageUrl
          );
        }
      }
      const roomName = chat?._id?.toString();
      const rooms = io.sockets.adapter.rooms;
      if (rooms.has(roomName) && rooms.get(roomName)?.has(receiverSocketId)) {
        console.log(
          `Người dùng có id ${receiverId} đã tham gia vào phòng ${roomName}.`
        );
        io.to(roomName).emit("fetchChat", newMessageFormatted);
      } else {
        console.log(
          `Người dùng có id ${receiverId} chưa tham gia vào phòng ${roomName}.`
        );
        io.to(receiverSocketId).emit("receiveMessage", newMessageFormatted);
      }

      return res.status(201).json({
        success: true,
        message: "Send Message successfully",
        newMessage: newMessageFormatted,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.messsage });
    }
  },

  // FETCH MESSAGE //
  fetchMessage: async (req: Request, res: Response) => {
    try {
      const senderId = req.user.userId;
      // const page = parseInt(req.query.page as string) || 1;
      const limitMessage = 20;
      // const skipMessage = (page - 1) * limitMessage;
      const { selectedUserId, lastMessageCreatedAt } = req.query;
      let query = {};
      if (lastMessageCreatedAt) {
        const createdAt =
          typeof lastMessageCreatedAt === "string"
            ? new Date(lastMessageCreatedAt)
            : lastMessageCreatedAt;
        query = { createdAt: { $lt: createdAt } };
        console.log(query);
      }
      const messages = await Message.find({
        $or: [
          { senderId: senderId, receiverId: selectedUserId },
          { senderId: selectedUserId, receiverId: senderId },
        ],
        ...query,
      })
        .sort({ createdAt: -1 })
        .limit(limitMessage)
        .populate("senderId", ["username", "_id"]);
      const messagesFormatted = messages.map((message) => {
        const decryptedMessage = message.message
          ? decryptMessage(message.message)
          : "";
        const decryptedImageMessage = message.imageUrl
          ? decryptMessage(message.imageUrl)
          : null;
        return {
          ...message.toObject(),
          message: decryptedMessage,
          imageUrl: decryptedImageMessage,
        };
      });
      let chat = await Chat.findOne({
        $or: [
          {
            "participants.senderId": senderId,
            "participants.receiverId": selectedUserId,
          },
          {
            "participants.senderId": selectedUserId,
            "participants.receiverId": senderId,
          },
        ],
      });
      if (!chat) {
        chat = await Chat.create({
          participants: { senderId: senderId, receiverId: selectedUserId },
        });
      }
      // console.log(messagesFormatted);
      return res.status(201).json({
        success: true,
        message: "Fetch Message successfully",
        messages: messagesFormatted,
        chatId: chat?._id,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.messsage });
    }
  },

  // GET USER FRIENDS //
  getUserFriend: async (req: Request, res: Response) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId).populate("friends", [
        "username",
        "email",
        "picturePath",
      ]);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
      const friends = user?.friends;
      return res.status(200).json({
        success: true,
        message: "Get User Friends Successfully",
        friends: friends,
        // friendsFormatted: friendsFormatted,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteMessage: async (req: Request, res: Response) => {
    let isValidMessage = true;
    try {
      const userLoggedId = req.user.userId;
      const messages = req.body.messages;
      const receiverId = req.body.receiverId;
      if (!Array.isArray(messages) || messages.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Tin nhắn không tồn tại" });
      }
      for (const message of messages) {
        if (message.senderId._id !== userLoggedId) {
          isValidMessage = false;
          break;
        }
      }
      if (!isValidMessage) {
        return res
          .status(403)
          .json({ message: "Tin nhắn này không phải của bạn, hãy thử lại" });
      }
      let chat = await Chat.findOne({
        $or: [
          {
            "participants.senderId": userLoggedId,
            "participants.receiverId": receiverId,
          },
          {
            "participants.senderId": receiverId,
            "participants.receiverId": userLoggedId,
          },
        ],
      });
      for (const message of messages) {
        await Message.findByIdAndDelete(message._id);
      }
      if (chat) {
        chat.messages = chat.messages.filter(
          (item) =>
            !messages
              .map((message) => message._id.toString())
              .includes(item.toString())
        );
        await chat.save();
      }
      io.to(chat?._id.toString()).emit("deletedMessage", {
        deletedMessages: messages,
      });
      return res
        .status(200)
        .json({ message: "Thu hồi nhắn thành công", success: true });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  fetchChat: async (req: Request, res: Response) => {
    try {
      const userLoggedId = req.user.userId;
      const conversations = await Chat.find({
        $or: [
          { "participants.senderId": userLoggedId },
          { "participants.receiverId": userLoggedId },
        ],
      }).sort({ updatedAt: "desc" });
      const userInfoPromises = conversations.map(async (item) => {
        const partnerId =
          userLoggedId === item?.participants.senderId._id.toString()
            ? item?.participants.receiverId._id.toString()
            : item?.participants.senderId._id.toString();

        const partnerInfo = await User.findById(partnerId).select(
          "username _id picturePath"
        );
        const lastMessageId = item.messages[item.messages.length - 1];
        const lastMessage = await Message.findById(lastMessageId);
        // console.log(lastMessage);
        let lastMessageFormatted;
        if (lastMessage?.messageType === "image" && lastMessage?.imageUrl) {
          lastMessageFormatted = decryptMessage(lastMessage.imageUrl);
        } else if (
          lastMessage?.messageType === "text" &&
          lastMessage?.message
        ) {
          lastMessageFormatted = decryptMessage(lastMessage.message);
        }
        const senderId = lastMessage?.senderId?.toString();
        return {
          userInfo: partnerInfo,
          chatId: item._id.toString(),
          lastMessage: { lastMessageFormatted, senderId },
        };
      });

      const userInfoWithConversationId = await Promise.all(userInfoPromises);

      return res.status(200).json({
        success: true,
        message: "Fetching Conversation",
        chatInfo: userInfoWithConversationId,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
  // //ADD OR REMOVE FRIEND
  // addRemoveFriend: async (req: Request, res: Response) => {
  //   try {
  //     const userId = req.user.userId;
  //     const friendId = req.params.friendId;
  //     const user = await User.findById(userId);
  //     const friend = await User.findById(friendId);
  //     if (user?.friends.includes(friendId)) {
  //       user.friends = user.friends.filter((id) => id !== friendId);
  //       friend!.friends = friend!.friends.filter((id) => id !== userId);
  //     } else {
  //       user?.friends.push(friendId);
  //       friend?.friends.push(userId);
  //     }
  //     await user?.save();
  //     await friend?.save();
  //     const friends = await Promise.all(
  //       user!.friends.map((id) => {
  //         return User.findById(id).select("-password");
  //       })
  //     );
  //     const friendsFormatted = friends.map((friend) => {
  //       const username = friend?.username;
  //       const occupation = friend?.occupation;
  //       const location = friend?.location;
  //       const picturePath = friend?.picturePath;
  //       return {
  //         username,
  //         occupation,
  //         location,
  //         picturePath,
  //       };
  //     });
  //     return res.status(201).json({
  //       success: true,
  //       message: "Friend Added or Removed Successfully",
  //       user,
  //       friendsFormatted,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({ success: false, message: error.message });
  //   }
  // },

  getIdChat: async (req: Request, res: Response) => {
    try {
      const userLoggedId = req.user?.userId;
      const selectedUserId = req.query?.selectedUserId;
      let chat = await Chat.findOne({
        $or: [
          {
            "participants.senderId": userLoggedId,
            "participants.receiverId": selectedUserId,
          },
          {
            "participants.senderId": selectedUserId,
            "participants.receiverId": userLoggedId,
          },
        ],
      });
      const chatId = chat?._id;
      if (chatId) {
        return res.status(200).json({
          success: true,
          message: "GET CHAT ID SUCCESSFULLY",
          chatId: chatId,
        });
      } else {
        return res.status(400).json({
          success: false,
          chatId: null,
        });
      }
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
  findUser: async (req: Request, res: Response) => {
    try {
      const searchQuery: string | undefined =
        typeof req.query["q"] === "string" ? req.query["q"] : undefined;

      if (searchQuery) {
        const users = await User.find({
          username: { $regex: searchQuery, $options: "i" },
        }).select("_id username picturePath");

        if (users?.length > 0) {
          return res.status(200).json({
            success: true,
            message: "List users",
            users: users,
          });
        } else {
          return res.status(200).json({
            success: true,
            message: "Không tìm thấy user",
          });
        }
      } else {
        return res.status(200).json({
          success: true,
          message: "Không tìm thấy user",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default userController;
