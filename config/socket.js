import { Server } from "socket.io";
import { EVENTS } from "../utils/constants.js";
import {
  handleCreateBoard,
  handleBoardDraw,
  handleFreehand,
} from "../controllers.js/boardController.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on(EVENTS.BOARD.CREATE, (data) => {
      // Join the socket to a room with the name of the boardId
      socket.join(data.boardId);
      console.log(`Socket ${socket.id} joined room: ${data.boardId}`);

      handleCreateBoard(socket, data);
    });

    socket.on(EVENTS.BOARD.DRAW, (data) => handleBoardDraw(socket, data));
    socket.on(EVENTS.BOARD.FREEHAND, (data) => handleFreehand(socket, data));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
