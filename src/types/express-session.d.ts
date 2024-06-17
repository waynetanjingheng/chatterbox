import session from "express-session";

declare module "express-session" {
  export interface SessionData {
    isAuthenticated?: boolean;
    user?: { [key: string]: any };
  }
}
