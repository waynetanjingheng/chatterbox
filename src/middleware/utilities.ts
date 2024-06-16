import type { RequestHandler } from "express";

export const csrf: RequestHandler = (req, res, next) => {
  res.locals.teoken = req.csrfToken();
  next();
};
