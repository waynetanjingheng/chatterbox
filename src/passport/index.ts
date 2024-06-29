import passport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import config from "../config";
import { Express } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as LocalStrategy } from "passport-local";
import * as passwordUtils from "./password";
import * as user from "./user";
import { User } from "./model/user";
import { get } from "lodash";

const WRONG_USERNAME_OR_PASSWORD = "Wrong Username or Password!";

passport.use(
    new FacebookStrategy(
        {
            clientID: config.facebook.clientID || "",
            clientSecret: config.facebook.clientSecret || "",
            callbackURL: config.host + config.routes.facebookAuthCallback,
        },
        (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (error: any, user?: any, info?: any) => void,
        ) => {
            done(null, profile);
        },
    ),
);

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google.clientID || "",
            clientSecret: config.google.clientSecret || "",
            callbackURL: config.host + config.routes.googleAuthCallback,
            passReqToCallback: true,
        },
        function (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (error: any, user?: any, info?: any) => void,
        ) {
            done(null, profile);
        },
    ),
);

passport.use(
    new LocalStrategy((username: string, password: string, done: Function) => {
        user.findByUsername(username, (err: Error | null, profile: User) => {
            if (profile) {
                passwordUtils.checkPassword(
                    password,
                    get(profile, password),
                    get(profile, "salt"),
                    get(profile, "work"),
                    (err: Error | null, isAuth: boolean) => {
                        if (isAuth) {
                            if (
                                get(profile, "work") < config.crypto.workFactor
                            ) {
                                // User is authenticated but password is not secure enough
                                user.updatePassword(
                                    username,
                                    password,
                                    config.crypto.workFactor,
                                );
                            }
                            done(null, profile);
                        } else {
                            // User exists but wrong credentials given
                            done(null, false, {
                                message: WRONG_USERNAME_OR_PASSWORD,
                            });
                        }
                    },
                );
            } else {
                // User does not exist
                done(null, false, { message: WRONG_USERNAME_OR_PASSWORD });
            }
        });
    }),
);

passport.serializeUser((user: Express.User, done) => {
    done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
});

const routes = (app: Express) => {
    app.get(config.routes.facebookAuth, passport.authenticate("facebook"));
    app.get(
        config.routes.facebookAuthCallback,
        passport.authenticate("facebook", {
            successRedirect: config.routes.chat,
            failureRedirect: config.routes.login,
            failureFlash: false,
        }),
    );
    app.get(
        config.routes.googleAuth,
        passport.authenticate("google", {
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ],
        }),
    );
    app.get(
        config.routes.googleAuthCallback,
        passport.authenticate("google", {
            successRedirect: config.routes.chat,
            failureRedirect: config.routes.login,
            failureFlash: false,
        }),
    );
    app.post(
        config.routes.login,
        passport.authenticate("local", {
            successRedirect: config.routes.chat,
            failureRedirect: config.routes.login,
            failureFlash: false,
        }),
    );
};

export { passport, routes };
