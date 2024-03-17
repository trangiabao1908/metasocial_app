import { io } from "socket.io-client";
const socket = io("https://metasocial-app.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("Connected to the Socket.IO server to send messages");
});
export default socket;
