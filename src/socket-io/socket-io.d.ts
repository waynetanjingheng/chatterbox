export interface ServerToClientEvents {
  ping: () => void;
}

export interface ClientToServerEvents {
  pong: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
