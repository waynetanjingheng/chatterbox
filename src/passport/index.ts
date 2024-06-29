import passport from "passport";
import { Strategy as FacebookStrategy, Profile } from "passport-facebook";
import config from "../config";
import { Express } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";

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
      done: (error: any, user?: any, info?: any) => void
    ) => {
      done(null, profile);
    }
  )
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
      done: (error: any, user?: any, info?: any) => void
    ) {
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
  app.get(
    config.routes.googleAuth,
    passport.authenticate("google", {
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    })
  );
  app.get(
    config.routes.googleAuthCallback,
    passport.authenticate("google", {
      successRedirect: config.routes.chat,
      failureRedirect: config.routes.login,
      failureFlash: false,
    })
  );
};

export { passport, routes };
