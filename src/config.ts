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
  },
  facebook: {
    appID: process.env.FACEBOOK_APP_ID,
    appSecret: process.env.FACEBOOK_APP_SECRET,
  },
};

export default config;
