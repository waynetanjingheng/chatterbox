import * as passUtil from "./password";
import { User, UsersType } from "./model/user";
import { get, set } from "lodash";
import { v4 as uuidv4 } from "uuid";

// TODO: Replace with db
// NOT production safe, just for placeholder
const Users: UsersType = {};

const findByUsername = (username: string, callback: Function) => {
    callback(null, get(Users, username));
};

const addUser = (
    username: string,
    password: string,
    work: number,
    callback: Function,
) => {
    if (get(Users, username) === undefined) {
        passUtil.createPassword(
            password,
            (err: Error | null, salt: number, password: string) => {
                set(Users, username, {
                    salt: salt,
                    work: work,
                    displayName: username,
                    id: uuidv4(),
                    provider: "local",
                    username: username,
                    password: password,
                });
                console.log("User created!");
                console.log(Users);
            },
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
        },
    );
};

export { findByUsername, addUser, updatePassword };
