import dotenv from "dotenv";

dotenv.config();

const config = {
  port: process.env.PORT,
  sessionSecret: process.env.SESSION_SECRET,
  redisPort: process.env.REDIS_PORT,
  redisHost: process.env.REDIS_HOST,
  routes: {
    login: "/login",
    logout: "/logout",
  },
};

export default config;
