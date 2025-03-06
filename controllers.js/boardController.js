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

export const handleUpdateShape = async (socket, data) => {
  try {
    socket.to(data.updatedData.boardId).emit(EVENTS.SHAPE.UPDATE, data);
  } catch (error) {
    console.log("🚀 ~ handleUpdateShape ~ error:", error);
  }
};

export const handleSaveShape = async (socket, data) => {
  console.log("🚀 ~ handleSaveShape ~ data:", data);
  try {
    socket.to(data.data.boardId).emit(EVENTS.SHAPE.SAVE, data);

    await Shape.findOneAndUpdate(
      { shapeId: data.data.shapeId },
      {
        attrs: data.data.attrs,
      }
    );
  } catch (error) {
    console.log("🚀 ~ handleSaveShape ~ error:", error, data);
  }
};
