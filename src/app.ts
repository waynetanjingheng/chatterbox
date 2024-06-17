import express from "express";
import * as routes from "./routes/index";
import * as errorHandlers from "./middleware/errorhandlers";
import * as logging from "./middleware/logging";
import cookieParser from "cookie-parser";
import session from "express-session";
import RedisStore from "connect-redis";
import { createClient, RedisClientType } from "redis";
import csrf from "csurf";
import * as util from "./middleware/utilities";
import config from "./config";

const app = express();
const redisClient: RedisClientType = createClient({ url: config.REDIS_URL });
(async () => {
  await redisClient.connect();
})().catch((err) => console.log(err));

app.use(cookieParser(config.SESSION_SECRET));
app.use(
  session({
    secret: config.SESSION_SECRET as string,
    saveUninitialized: true,
    resave: true,
    store: new RedisStore({ client: redisClient }),
  })
);
app.use(util.templateRoutes);
app.use(logging.logger);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(csrf());
// app.use(util.csrf);
app.use(util.isAuthenticated);

app.get("/", routes.index);
app.get(config.ROUTES.login, routes.login);
app.post(config.ROUTES.login, routes.loginProcess);
app.get("/chat", util.requireAuthentication, routes.chat);
app.get("/error", (req, res, next) => next(new Error("A Contrived Error!")));
app.get(config.ROUTES.logout, routes.logOut);

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

app
  .listen(config.PORT, () => {
    console.log("Server running at PORT: ", config.PORT);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
