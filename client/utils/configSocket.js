import { io } from "socket.io-client";
const socket = io("http://192.168.1.9:8000");
socket.on("connect", () => {
  console.log("Connected to the Socket.IO server to send messages");
});
export default socket;
