import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import { Socket } from "socket.io";
import { httpServer as ExpressAppHttpServer } from "../app";
import { socketAuth } from "./middleware";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient, RedisClientType } from "redis";
import config from "../config";

const getIOServerInstance = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer);
  return io;
};

const onSocketConnection = (socket: Socket): void => {
  socket.on("GetMe", () => {});
  socket.on("GetUser", (room) => {});
  socket.on("GetChat", (data) => {});
  socket.on("AddChat", (chat) => {});
  socket.on("GetRoom", () => {});
  socket.on("AddRoom", (r) => {});
  socket.on("disconnect", () => {});
};

const establishSocketIOServer = (): void => {
  const io = getIOServerInstance(ExpressAppHttpServer);

  const pubClient: RedisClientType = createClient({
    socket: {
      host: config.redisHost,
      port: parseInt(config.redisPort || "6379", 10),
    },
  });
  const subClient = pubClient.duplicate();

  io.adapter(createAdapter(pubClient, subClient));

  const chatterbox = io.of("/chatterbox");

  chatterbox.use(socketAuth);
  chatterbox.on("connection", onSocketConnection);
};

export default establishSocketIOServer;
