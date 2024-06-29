type User = {
  salt: string;
  work: number;
  displayName: string;
  id: string;
  provider: string;
  username: string;
};

type UsersType = {
  [key: string]: User;
};

export { User, UsersType };
