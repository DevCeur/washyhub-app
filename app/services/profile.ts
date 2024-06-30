import { prisma } from "~/lib/database/database";

import { getUserId } from "~/utils/sessions/auth-session";

import { getAuthUser } from "./user";

interface GetAuthUserProfileOptions {
  request: Request;
}

export const getUserProfile = async ({ request }: GetAuthUserProfileOptions) => {
  try {
    const { userId } = await getUserId({ request });

    const profile = await prisma.profile.findUnique({ where: { user_id: userId } });

    return { profile };
  } catch (error) {
    throw new Error("Error getting auth user profile");
  }
};

interface CreateUserProfileOptions {
  request: Request;

  data: {
    first_name: string;
    last_name: string;
  };
}

export const createUserProfile = async ({ data, request }: CreateUserProfileOptions) => {
  try {
    const { user } = await getAuthUser({ request });

    const profile = await prisma.profile.create({
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        user_id: user?.id as string,
      },
    });

    return { profile };
  } catch (error) {
    throw new Error("Error creating a new profile");
  }
};

interface UpdateUserProfileOptions {
  request: Request;
  data: {
    first_name?: string;
    last_name?: string;
  };
}

export const updateUserProfile = async ({ data, request }: UpdateUserProfileOptions) => {
  try {
    const { user } = await getAuthUser({ request });

    const profile = await prisma.profile.update({
      data: { first_name: data.first_name, last_name: data.last_name },
      where: { user_id: user?.id },
    });

    return { profile };
  } catch (error) {
    throw new Error("Error updating profile");
  }
};
