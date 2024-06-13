import { Request, Response } from "express";

const index = (req: Request, res: Response) => {
  res.send("Index");
};

const login = (req: Request, res: Response) => {
  res.send("Login");
};

const loginProcess = (req: Request, res: Response) => {
  res.redirect("/");
};

const chat = (req: Request, res: Response) => {
  res.send("Chat");
};

export { index, login, loginProcess, chat };
