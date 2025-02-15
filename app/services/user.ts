import { prisma } from "~/lib/database/database";

import type { User } from "@prisma/client";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { createHash } from "~/utils/hash";
import { ERROR_MESSAGE } from "~/utils/enum";

import { getUserId } from "~/utils/sessions/auth-session";

interface CreateNewUserOptions {
  data: { email: string; password: string };
}

export const createNewUser = async ({
  data,
}: CreateNewUserOptions): Promise<{
  user: User | null;
  errors: { [x: string]: string } | null;
}> => {
  try {
    const user = await prisma.user.create({ data });

    return { user, errors: null };
  } catch (err) {
    const error = err as PrismaClientKnownRequestError;

    const errorsMeta = error.meta as { target: string[] };

    if (error.code === "P2002" && errorsMeta?.target[0] === "email") {
      return { user: null, errors: { email: "This email is already registered" } };
    }

    throw new Error("There was an error creating user");
  }
};

interface GetUserByIdOptions {
  id: string;
}

export const getUserById = async ({
  id,
}: GetUserByIdOptions): Promise<{
  user: User | null;
  errors: { [x: string]: string } | null;
}> => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });

    return { user, errors: null };
  } catch (err) {
    throw new Error("Error getting user by id");
  }
};

interface GetUserByEmailOptions {
  email: string;
}

export const getUserByEmail = async ({
  email,
}: GetUserByEmailOptions): Promise<{
  user: User | null;
  errors: { [x: string]: string } | null;
}> => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        user: null,
        errors: { credentials: ERROR_MESSAGE.INVALID_CREDENTIALS },
      };
    }

    return { user, errors: null };
  } catch (err) {
    throw new Error("Error getting user by email");
  }
};

interface UpdateUserPasswordOptions {
  userId: string;

  data: {
    newPassword: string;
    confirmPassword: string;
  };
}

export const updateUserPassword = async ({ userId, data }: UpdateUserPasswordOptions) => {
  try {
    const { hash: hashedPassword } = await createHash({ text: data.newPassword });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    await prisma.passwordResetToken.deleteMany({ where: { user_id: updatedUser.id } });

    return { success: true, errors: null };
  } catch (err) {
    throw new Error("Error updating user password");
  }
};

interface UpdateUserOptions {
  userId: string;

  data: Partial<User>;
}

export const updateUser = async ({ userId, data }: UpdateUserOptions) => {
  try {
    await prisma.user.update({
      where: { id: userId },
      data,
    });

    return { success: true, errors: null };
  } catch (err) {
    throw new Error("Error updating user password");
  }
};

interface GetAuthUserOptions {
  request: Request;
}

export const getAuthUser = async ({ request }: GetAuthUserOptions) => {
  try {
    const { userId } = await getUserId({ request });

    const { user } = await getUserById({ id: userId });

    return { user };
  } catch (error) {
    throw new Error("Error getting auth user");
  }
};
