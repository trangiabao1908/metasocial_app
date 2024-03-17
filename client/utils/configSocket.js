import { io } from "socket.io-client";
const socket = io("ws://metasocial-app.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("Connected to the Socket.IO server to send messages");
});
export default socket;
