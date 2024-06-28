import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { parse } from "cookie";
import cookieParser from "cookie-parser";
import config from "../config";
import { get } from "lodash";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient, RedisClientType } from "redis";
import { SessionData } from "express-session";

const establishRedisSessionStore = (): RedisClientType => {
  const redisClient: RedisClientType = createClient({
    socket: {
      host: config.redisHost,
      port: parseInt(config.redisPort || "6379", 10),
    },
  });
  redisClient.connect();
  return redisClient;
};

const getNotAuthenticatedError = () => {
  return new Error("Not Authenticated");
};

const socketAuth = (socket: Socket, next: (err?: ExtendedError) => void) => {
  try {
    const handshake = socket.request;
    const parsedCookie = parse(handshake.headers.cookie!);

    if (!handshake.headers.cookie) {
      console.log("No cookies present in the handshake.");
      return next(getNotAuthenticatedError());
    }

    const rawSid = get(parsedCookie, "connect.sid");
    if (!rawSid) {
      console.log("Session ID cookie is missing.");
      return next(getNotAuthenticatedError());
    }

    const sid = cookieParser.signedCookie(
      rawSid,
      config.sessionSecret as string
    ) as string;

    if (rawSid === sid) {
      console.log("Session ID mismatch.");
      return next(new Error("Not Authenticated"));
    }

    const redisClient = establishRedisSessionStore();
    const redisStore = new RedisStore({ client: redisClient });

    redisStore.get(sid, (err, session) => {
      if (err) {
        console.log("Error retrieving session from Redis:", err);
        return next(getNotAuthenticatedError());
      }
      if (session && (session as SessionData).isAuthenticated) {
        socket.user = (session as SessionData).user;
        socket.sid = (session as SessionData).sid;
        return next();
      } else {
        return next(getNotAuthenticatedError());
      }
    });
  } catch (error) {
    console.log("Authentication issue:", error);
    return next(getNotAuthenticatedError());
  }
};

export { socketAuth };
