import { io } from "socket.io-client";

const socket = io(process.env.EXPO_PUBLIC_API_URL, {
  transports: ["websocket"],
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("Connected to the Socket.IO server to send messages");
});
export default socket;
