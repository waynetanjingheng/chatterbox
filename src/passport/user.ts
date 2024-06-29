import * as passUtil from "./password";
import { User, UsersType } from "./model/user";
import { get, set } from "lodash";
import { v4 as uuidv4 } from "uuid";

// TODO: Replace with db
// NOT production safe, just for placeholder
const Users: UsersType = {
  wayne: {
    salt: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
    work: 5000,
    displayName: "Wayne",
    id: "e3a6d30e37cd42f09ba8b248c1a85fdd",
    provider: "local",
    username: "wayne",
  },
};

const findByUsername = (username: string, callback: Function) => {
  callback(null, get(Users, username));
};

const addUser = (
  username: string,
  password: string,
  work: number,
  callback: Function
) => {
  if (get(Users, username) === undefined) {
    passUtil.createPassword(
      password,
      (err: Error | null, salt: number, password: string) => {
        set(Users, username, {
          salt: salt,
          password: password,
          work: work,
          displayName: username,
          id: uuidv4(),
          provider: "local",
          username: username,
        });
      }
    );

    return callback(null, get(Users, username));
  } else {
    return callback({ errorCode: 1, message: "User exists!" }, null);
  }
};

const updatePassword = (username: string, password: string, work: number) => {
  passUtil.createPassword(
    password,
    (err: Error | null, salt: number, password: string) => {
      const user: User = get(Users, username);
      set(user, salt, salt);
      set(user, password, password);
      set(user, work, work);
    }
  );
};

export { findByUsername, addUser, updatePassword };
