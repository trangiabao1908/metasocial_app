import { io } from "socket.io-client";
const socket = io("http://192.168.1.11:443", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("Connected to the Socket.IO server to send messages");
});
export default socket;
