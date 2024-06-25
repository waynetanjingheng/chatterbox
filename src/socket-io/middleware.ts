import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { parse } from "cookie";
import cookieParser from "cookie-parser";
import config from "../config";
import { get } from "lodash";

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
    );

    if (rawSid !== sid) {
      console.log("Session ID mismatch.");
      return next(new Error("Not Authenticated"));
    }

    // Authentication successful
    console.log("Authentication successful.");
    next();
  } catch (error) {
    return next(new Error("Authentication issue..."));
  }
};

export { socketAuth };
