import * as crypto from "crypto";
const scmp = require("scmp");
import config from "../config";

const createPassword = (password: string, callback: Function) => {
    crypto.randomBytes(
        config.crypto.randomSize,
        (err: Error | null, salt: Buffer) => {
            if (err) return callback(err, null);

            crypto.pbkdf2(
                password,
                salt.toString("base64"),
                config.crypto.workFactor,
                config.crypto.keylen,
                "sha256",
                (err: Error | null, key: Buffer) => {
                    callback(
                        null,
                        salt.toString("base64"),
                        key.toString("base64"),
                    );
                },
            );
        },
    );
};

const checkPassword = (
    password: string,
    derivedPassword: string,
    salt: crypto.BinaryLike,
    work: number,
    callback: Function,
) => {
    crypto.pbkdf2(
        password,
        salt,
        work,
        config.crypto.keylen,
        "sha256",
        (err: Error | null, key: Buffer) => {
            callback(null, scmp(key.toString("base64"), derivedPassword));
        },
    );
};

export { createPassword, checkPassword };
