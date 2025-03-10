import { Server } from "socket.io";

import { EVENTS } from "../utils/constants.js";
import {
  handleCreateBoard,
  handleCreateShape,
  handleDrawShape,
  handleModifyDraw,
  handleModifyEnd,
  handleModifyStart,
  handleSaveShape,
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

    socket.on(EVENTS.SHAPE.CREATE, (data) => handleCreateShape(socket, data));
    socket.on(EVENTS.SHAPE.DRAW, (data) => handleDrawShape(socket, data));
    socket.on(EVENTS.SHAPE.SAVE, (data) => handleSaveShape(socket, data));

    socket.on(EVENTS.SHAPE.MODIFY_START, (data) =>
      handleModifyStart(socket, data)
    );
    socket.on(EVENTS.SHAPE.MODIFY_DRAW, (data) =>
      handleModifyDraw(socket, data)
    );
    socket.on(EVENTS.SHAPE.MODIFY_END, (data) => handleModifyEnd(socket, data));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
