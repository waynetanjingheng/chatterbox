import type { RequestHandler } from "express";
import { SessionData } from "express-session";
import config from "../config";

export const csrf: RequestHandler = (req, res, next) => {
  res.locals.teoken = req.csrfToken();
  next();
};

export const isAuthenticated: RequestHandler = (req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  if (req.session.isAuthenticated) res.locals.user = req.session.user;
  next();
};

export const requireAuthentication: RequestHandler = (req, res, next) => {
  if (req.session.isAuthenticated) next();
  else res.redirect(config.ROUTES.login);
};

export const auth = (
  username: string,
  password: string,
  session: SessionData
): boolean => {
  const isAuth = username === "wayne" || username === "bryan";
  if (isAuth) {
    session.isAuthenticated = true;
    session.user = { username: username };
  }
  return isAuth;
};

export const logOut = (session: SessionData): void => {
  session.isAuthenticated = false;
  delete session.user;
};

export const templateRoutes: RequestHandler = (req, res, next) => {
  res.locals.routes = config.ROUTES;
  next();
};
