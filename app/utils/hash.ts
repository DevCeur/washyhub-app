import argon2 from "argon2";

const PASSWORD_SECRET = process.env.PASSWORD_SECRET;

if (!PASSWORD_SECRET) throw new Error("PASSWORD_SECRET env variable required");

export const createHash = async ({ text }: { text: string }) => {
  try {
    const hash = await argon2.hash(text);

    return {
      hash,
    };
  } catch (error) {
    throw new Error("Error creating hash");
  }
};

export const verifyPassword = async ({ hash, text }: { hash: string; text: string }) => {
  try {
    return {
      success: await argon2.verify(hash, text),
    };
  } catch (error) {
    throw new Error("Error verifying hash");
  }
};
