import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    boardId: { type: String, required: true, unique: true },
    jsonData: { type: String, required: true },
    // Store references to shapes in a separate collection
    shapeIds: [{ type: String, ref: "Shape" }],
  },
  { timestamps: true }
);

const Board = mongoose.model("Board", boardSchema);
export default Board;
