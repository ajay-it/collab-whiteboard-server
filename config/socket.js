import { Server } from "socket.io";
import { EVENTS } from "../utils/constants.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Example event
    socket.on("message", (data) => {
      console.log(`Message received: ${data}`);
      io.emit("message", data);
    });

    socket.on(EVENTS.BOARD.CREATE, (data) => {
      console.log("Board data", data);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
