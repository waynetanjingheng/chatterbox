import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Socket } from "socket.io";
import { httpServer as ExpressAppHttpServer } from "../app";
import { socketAuth } from "./middleware";

const getIOServerInstance = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer);
  return io;
};

const onSocketConnection = (socket: Socket): void => {
  socket.emit("message", { message: "Hey!" });
};

const establishSocketIOServer = (): void => {
  const io = getIOServerInstance(ExpressAppHttpServer);

  const chatterbox = io.of("/chatterbox");
  chatterbox.use(socketAuth);
  chatterbox.on("connection", onSocketConnection);
};

export default establishSocketIOServer;
