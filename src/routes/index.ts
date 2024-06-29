import { Request, Response } from "express";
import * as util from "../middleware/utilities";
import { SessionData } from "express-session";
import config from "../config";

export const index = (req: Request, res: Response) => {
  res.send("Index");
};

export const login = (req: Request, res: Response) => {
  res.send("Login");
};

export const chat = (req: Request, res: Response) => {
  res.send("Chat");
};

export const logOut = (req: Request, res: Response) => {
  util.logOut(req);
  res.redirect("/");
};
