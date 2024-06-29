import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  host: process.env.HOST,
  routes: {
    login: "/login",
    logout: "/logout",
    chat: "/chat",
    facebookAuth: "/auth/facebook",
    facebookAuthCallback: "/auth/facebook/callback",
    googleAuth: "/auth/google",
    googleAuthCallback: "/auth/google/callback",
  },
  facebook: {
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_ID,
  },
  crypto: {
    workFactor: 5000,
    keylen: 32,
    randomSize: 256,
  },
};

export default config;
