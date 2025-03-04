import express from "express";
import cors from "cors";
import { createServer } from "http";
import { initSocket } from "./config/socket.js";

const app = express();
const httpServer = createServer(app);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server online");
});

initSocket(httpServer);

const port = 8080;
httpServer.listen(port, () => {
  console.log("Server listening on port", port);
});
