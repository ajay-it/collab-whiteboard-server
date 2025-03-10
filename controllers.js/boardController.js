import Board from "../models/board.js";
import Shape from "../models/shape.js";
import { EVENTS } from "../utils/constants.js";

export const handleCreateBoard = async (socket, data) => {
  try {
    let existingBoard = await Board.findOne({ boardId: data.boardId });

    if (existingBoard) {
      // Board already in db
      const shapes = await Shape.find({ boardId: data.boardId });

      socket.emit(EVENTS.BOARD.LOAD, { existingBoard, shapes });
    } else {
      // Board doesn't exist
      await Board.create({
        boardId: data.boardId,
        jsonData: data.stageJSON,
      });
    }
  } catch (error) {
    console.error("Error in handleCreateBoard:", error);
  }
};

export const handleCreateShape = async (socket, data) => {
  try {
    const { initialData } = data;

    socket.to(initialData.boardId).emit(EVENTS.SHAPE.CREATE, data);

    // Create the shape document
    await Shape.create({ ...initialData });

    await Board.findOneAndUpdate(
      { boardId: initialData.boardId },
      { $push: { shapeIds: initialData.shapeId } }
    );
  } catch (error) {
    console.log("🚀 ~ handleCreateShape ~ error:", error);
  }
};

export const handleDrawShape = async (socket, data) => {
  try {
    socket.to(data.updatedData.boardId).emit(EVENTS.SHAPE.DRAW, data);
  } catch (error) {
    console.log("🚀 ~ handleDrawShape ~ error:", error);
  }
};

export const handleSaveShape = async (socket, data) => {
  try {
    socket.to(data.data.boardId).emit(EVENTS.SHAPE.SAVE, data);

    await Shape.findOneAndUpdate(
      { shapeId: data.data.shapeId },
      {
        attrs: data.data.attrs,
      }
    );
  } catch (error) {
    console.log("🚀 ~ handleSaveShape ~ error:", error);
  }
};

export const handleModifyStart = (socket, data) => {
  try {
    socket.to(data.initialData.boardId).emit(EVENTS.SHAPE.MODIFY_START, data);
  } catch (error) {
    console.log("🚀 ~ handleModifyStart ~ error:", error);
  }
};

export const handleModifyDraw = (socket, data) => {
  try {
    socket.to(data.updatedData.boardId).emit(EVENTS.SHAPE.MODIFY_DRAW, data);
  } catch (error) {
    console.log("🚀 ~ handleModifyDraw ~ error:", error);
  }
};

export const handleModifyEnd = async (socket, data) => {
  try {
    socket.to(data.saveData.boardId).emit(EVENTS.SHAPE.MODIFY_END, data);

    await Shape.findOneAndUpdate(
      { shapeId: data.saveData.shapeId },
      {
        $set: {
          "attrs.x": data.saveData.x,
          "attrs.y": data.saveData.y,
        },
      }
    );
  } catch (error) {
    console.log("🚀 ~ handleModifyEnd ~ error:", error);
  }
};
