const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import { Socket } from "socket.io";
import configMongoose from "./database/config";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import userRoutes from "./routes/user";
import notificationRoutes from "./routes/notification";

// Mongodb config
dotenv.config();
configMongoose();

const app = express();
const http = require("http").createServer(app);
export const io = require("socket.io")(http);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());
app.use(cookieParser());
/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listing on port ${PORT}`);
});
export const sessionsMap: Record<string, string> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected");
  console.log("SocketId: " + socket.id);

  socket.on("userIdLogged", (userId) => {
    console.log("UserId: " + userId);
    if (userId) {
      sessionsMap[userId] = socket.id;
      console.log(sessionsMap);
    }
  });
  socket.on("chatId", (chatId) => {
    console.log("ChatId: " + chatId);
    socket.join(chatId);
  });
  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
    console.log(`leaveRoom: ${chatId}`);
  });
  socket.on("disconnect", () => {
    for (const userId in sessionsMap) {
      if (sessionsMap[userId] === socket.id) {
        delete sessionsMap[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
http.listen(443, () => {
  console.log("Socket.IO listening on port 443");
});
