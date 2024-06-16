import express from "express";
import * as routes from "./routes/index";
import * as errorHandlers from "./middleware/errorhandlers";
import * as logging from "./middleware/logging";
import cookieParser from "cookie-parser";
import session from "express-session";
import RedisStore from "connect-redis";
import dotenv from "dotenv";
import { createClient, RedisClientType } from "redis";
import csrf from "csurf";
import * as util from "./middleware/utilities";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET || "redis://localhost:6379";
const REDIS_URL = process.env.REDIS_URL;
const redisClient: RedisClientType = createClient({ url: REDIS_URL });
(async () => {
  await redisClient.connect();
})().catch((err) => console.log(err));

app.use(cookieParser(SESSION_SECRET));
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({ client: redisClient }),
  })
);
app.use(logging.logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(csrf());
app.use(util.csrf);

app.get("/", routes.index);
app.get("/login", routes.login);
app.post("/login", routes.loginProcess);
app.get("/chat", routes.chat);
app.get("/error", (req, res, next) => next(new Error("A Contrived Error!")));

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app
  .listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
