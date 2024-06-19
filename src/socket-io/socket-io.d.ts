export interface ServerToClientEvents {
  ping: (data: Data) => void;
  userJoined: (data: Data) => void;
}

export type Data = {
  username: string;
};

export interface ClientToServerEvents {
  join: (data: Data) => void;
  ping: { username: string };
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
