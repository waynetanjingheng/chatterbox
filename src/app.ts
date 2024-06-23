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
import { createServer } from "http";
import establishSocketIOServer from "./socket-io";

const app = express();
const redisClient: RedisClientType = createClient({
  socket: {
    host: config.redisHost,
    port: parseInt(config.redisPort || "6379", 10),
  },
});
(async () => {
  await redisClient.connect();
})().catch((err) => console.log(err));

app.use(cookieParser(config.sessionSecret));
app.use(
  session({
    secret: config.sessionSecret as string,
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
app.get(config.routes.login, routes.login);
app.post(config.routes.login, routes.loginProcess);
app.get("/chat", util.requireAuthentication, routes.chat);
app.get("/error", (req, res, next) => next(new Error("A Contrived Error!")));
app.get(config.routes.logout, routes.logOut);

app.use(errorHandlers.error);
app.use(errorHandlers.notFound);

export const httpServer = createServer(app);

establishSocketIOServer(httpServer);

httpServer
  .listen(config.port, () => {
    console.log("Server running at PORT: ", config.port);
  })
  .on("error", (error) => {
    // gracefully handle error
    throw new Error(error.message);
  });
