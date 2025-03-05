import mongoose from "mongoose";

const shapeSchema = new mongoose.Schema(
  {
    boardId: { type: String, ref: "Board", required: true },
    attrs: { type: Object, required: true },
    tool: { type: String, required: true },
    className: { type: String, required: true },
  },
  { timestamps: true, strict: false }
);

const Shape = mongoose.model("Shape", shapeSchema);
export default Shape;
