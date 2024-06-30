import type { Request, RequestHandler } from "express";
import { SessionData } from "express-session";
import config from "../config";

export const csrf: RequestHandler = (req, res, next) => {
    res.locals.teoken = req.csrfToken();
    next();
};

export const isAuthenticated: RequestHandler = (req, res, next) => {
    req.session.isAuthenticated = req.session.passport?.user !== undefined;
    res.locals.isAuthenticated = req.session.isAuthenticated;
    if (req.session.isAuthenticated) res.locals.user = req.session.user;
    next();
};

export const requireAuthentication: RequestHandler = (req, res, next) => {
    if (req.session.isAuthenticated) next();
    else res.redirect(config.routes.login);
};

export const auth = (
    username: string,
    password: string,
    session: SessionData,
): boolean => {
    const isAuth = username === process.env.ALLOWED_USERNAME;
    if (isAuth) {
        session.isAuthenticated = true;
        session.user = { username: username };
    }
    return isAuth;
};

export const logOut = (req: Request): void => {
    req.session.isAuthenticated = false;
    req.logout((err) => {
        if (err) console.log(err);
    });
    console.log("User successfully logged out.");
};

export const templateRoutes: RequestHandler = (req, res, next) => {
    res.locals.routes = config.routes;
    next();
};
