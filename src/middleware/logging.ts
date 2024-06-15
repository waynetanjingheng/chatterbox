import type { RequestHandler } from "express";

export const logger: RequestHandler = (req, res, next) => {
  console.log(req.url);
  next();
};
