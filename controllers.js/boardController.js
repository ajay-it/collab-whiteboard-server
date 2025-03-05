import Board from "../models/board.js";
import Shape from "../models/shape.js";
import { EVENTS } from "../utils/constants.js";

export const handleCreateBoard = async (socket, data) => {
  try {
    const existingBoard = await Board.findOne({ boardId: data.boardId });

    if (existingBoard) {
      // Board already in db
      socket.to(data.boardId).emit(EVENTS.BOARD.LOAD, existingBoard);
    } else {
      // Board doesn't exist
      const newBoard = await Board.create({
        boardId: data.boardId,
        jsonData: data.stageJSON,
      });
    }
  } catch (error) {
    console.error("Error in handleCreateBoard:", error);
  }
};

export const handleBoardDraw = async (socket, data) => {
  try {
    socket.to(data.boardId).emit(EVENTS.BOARD.DRAW, data);

    // Create the shape document
    await Shape.create({ ...data });

    await Board.findOneAndUpdate(
      { boardId: data.boardId },
      { $push: { shapeIds: data.shapeId } }
    );
  } catch (error) {
    console.log("🚀 ~ handleBoardDraw ~ error:", error);
  }
};

export const handleFreehand = async (socket, data) => {
  try {
    socket.to(data.boardId).emit(EVENTS.BOARD.FREEHAND, data);

    await Shape.findOneAndUpdate(
      { shapeId: data.shapeId },
      { $push: { "attrs.points": { $each: data.points } } }
    );
  } catch (error) {
    console.log("🚀 ~ handleFreehand ~ error:", error);
  }
};
