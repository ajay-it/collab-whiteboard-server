export const EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",

  BOARD: {
    CREATE: "board.create",
    LOAD: "board.load",
    DRAW: "board.draw",
  },

  SHAPE: {
    CREATE: "shape.create",
    DRAW: "shape.draw",
    SAVE: "shape.save",
    MODIFY_START: "shape.modify_start",
    MODIFY_DRAW: "shape.modify_draw",
    MODIFY_END: "shape.modify_end",
    DELETE: "shape.delete",
  },
};
