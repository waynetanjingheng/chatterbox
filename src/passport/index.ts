import passport from "passport";
import {
  Strategy as FacebookStrategy,
  Profile as FacebookProfile,
} from "passport-facebook";
import config from "../config";
import { Express } from "express";

passport.use(
  new FacebookStrategy(
    {
      clientID: config.facebook.appID!,
      clientSecret: config.facebook.appSecret!,
      callbackURL: config.host + config.routes.facebookAuthCallback,
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: FacebookProfile,
      done: (error: any, user?: any, info?: any) => void
    ) => {
      done(null, profile);
    }
  )
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
    })
  );
};

export { passport, routes };
