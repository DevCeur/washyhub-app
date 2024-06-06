import { prisma } from "~/lib/database/database";

import type { User } from "@prisma/client";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

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

    return { user: null, errors: { server: "There was an error creating user" } };
  }
};
