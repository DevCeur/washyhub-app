import crypto from "node:crypto";

import { prisma } from "~/lib/database/database";

interface SaveTokenOptions {
  token: string;
  userId: string;
}

const MINUTES_TO_EXPIRE = 10;

export const saveToken = async ({ token, userId }: SaveTokenOptions) => {
  try {
    const expireDate = new Date();

    expireDate.setMinutes(expireDate.getMinutes() + MINUTES_TO_EXPIRE);

    await prisma.passwordResetToken.create({
      data: { user_id: userId, token, expiry_date: expireDate },
    });

    return { success: true, errors: null };
  } catch (err) {
    return { success: false, errors: { server: "Error saving token in database" } };
  }
};

interface VerifyTokenOptions {
  token: string;
}

export const verifyToken = async ({ token }: VerifyTokenOptions) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const dbToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!dbToken) {
      return { isValid: false, errors: { server: "This token is not valid" } };
    }

    if (dbToken.expiry_date < new Date()) {
      return { isValid: false, errors: { server: "This token has expired" } };
    }

    return { isValid: true, errors: null };
  } catch (err) {
    return { isValid: false, errors: { server: "Error getting token" } };
  }
};
