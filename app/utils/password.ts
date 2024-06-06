import argon2 from "argon2";

import type { Options } from "argon2";

const PASSWORD_SECRET = process.env.PASSWORD_SECRET;

if (!PASSWORD_SECRET) throw new Error("PASSWORD_SECRET env variable required");

const hashOptions: Options = {
  salt: 2,
};

export const hashPassword = async ({ password }: { password: string }) => {
  try {
    const hashedPassword = await argon2.hash(password);

    return {
      hashedPassword,
    };
  } catch (error) {
    throw new Error("Error hashing password");
  }
};

export const veryPassword = async ({
  hash,
  password,
}: {
  hash: string;
  password: string;
}) => {
  try {
    return {
      success: await argon2.verify(hash, password, hashOptions),
    };
  } catch (error) {
    throw new Error("Error verifying hash");
  }
};
