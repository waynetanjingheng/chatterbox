import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  ROUTES: {
    login: "/login",
    logout: "/logout",
  },
};

export default config;
