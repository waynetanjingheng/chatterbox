import { Request, Response } from "express";

export const index = (req: Request, res: Response) => {
  console.log(req.cookies);
  res.send("Index");
};

export const login = (req: Request, res: Response) => {
  res.send("Login");
};

export const loginProcess = (req: Request, res: Response) => {
  res.redirect("/");
};

export const chat = (req: Request, res: Response) => {
  res.send("Chat");
};
