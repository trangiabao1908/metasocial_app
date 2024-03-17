import { io } from "socket.io-client";
const socket = io("http://192.168.70.61:3000", {
  transports: ["websocket"],
  withCredentials: true,
});
socket.on("connect", () => {
  console.log("Connected to the Socket.IO server to send messages");
});
export default socket;
