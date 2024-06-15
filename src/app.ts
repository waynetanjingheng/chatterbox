import express from "express";
import * as routes from "./routes/index";
import * as errorHandlers from "./middleware/errorhandlers";
import * as logging from "./middleware/logging";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET as string;

app.use(cookieParser());
app.use(session({ secret: SESSION_SECRET }));
app.use(logging.logger);

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
