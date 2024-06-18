import { Server } from "socket.io";
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from "./socket-io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server);

io.on("connection", (socket) => {
  socket.emit("ping");

  socket.on("pong", () => {
    console.log("pong");
  });
});

server.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});
