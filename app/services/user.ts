import { prisma } from "~/lib/database/database";

import type { User } from "@prisma/client";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { createHash } from "~/utils/hash";

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

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, errors: null };
  } catch (err) {
    throw new Error("Error updating user password");
  }
};
