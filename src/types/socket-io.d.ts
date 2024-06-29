import { Socket } from "socket.io";

declare module "socket.io" {
    export interface Socket {
        user?: { [key: string]: any };
        sid?: string;
    }
}
