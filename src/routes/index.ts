import { Request, Response } from "express";
import * as util from "../middleware/utilities";
import config from "../config";
import * as user from "../passport/user";
import { User } from "../passport/model/user";

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

export const register = (req: Request, res: Response) => {
    res.send("Register");
};

export const registerProcess = (req: Request, res: Response) => {
    if (req.body.username && req.body.password) {
        user.addUser(
            req.body.username,
            req.body.password,
            config.crypto.workFactor,
            (err: Error | null, profile: User) => {
                if (err) {
                    res.redirect(config.routes.register);
                } else {
                    req.login(profile, (err: Error | null) => {
                        res.redirect(config.routes.chat);
                    });
                }
            },
        );
    } else {
        res.redirect(config.routes.register);
    }
};
