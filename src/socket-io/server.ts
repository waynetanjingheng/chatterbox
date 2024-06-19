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
  socket.on("join", (data) => {
    io.emit("userJoined", data);
    socket.username = data.username;
  });
  socket.on("ping", { username: socket.username });
});

server.listen(4000, () => {
  console.log(`Server is running on port ${4000}`);
});
