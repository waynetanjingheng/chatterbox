import type { ErrorRequestHandler, RequestHandler } from "express";

export const notFound: RequestHandler = (req, res, next) => {
  res.status(404).send("Oops! Wrong turn...");
};

export const error: ErrorRequestHandler = (err, req, res, next) => {
  console.log(`Error: ${err}`);
  res.status(500).send("Something broke. What did you do?");
};
