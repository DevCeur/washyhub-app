import { prisma } from "~/lib/database/database";

interface GetUserProfileByIdOptions {
  userId: string;
}

export const getUserProfileById = async ({ userId }: GetUserProfileByIdOptions) => {
  try {
    const profile = await prisma.profile.findUnique({ where: { user_id: userId } });

    return { profile };
  } catch (error) {
    throw new Error("Error getting user profile by id");
  }
};

interface CreateUserProfileOptions {
  userId: string;
  data: {
    first_name: string;
    last_name: string;
  };
}

export const createUserProfile = async ({ data, userId }: CreateUserProfileOptions) => {
  try {
    const profile = await prisma.profile.create({
      data: { first_name: data.first_name, last_name: data.last_name, user_id: userId },
    });

    return { profile };
  } catch (error) {
    console.log(error);

    throw new Error("Error creating a new profile");
  }
};

interface UpdateUserProfileOptions {
  userId: string;

  data: {
    first_name?: string;
    last_name?: string;
  };
}

export const updateUserProfile = async ({ data, userId }: UpdateUserProfileOptions) => {
  try {
    const profile = await prisma.profile.update({
      data: { first_name: data.first_name, last_name: data.last_name },
      where: { user_id: userId },
    });

    return { profile };
  } catch (error) {
    throw new Error("Error creating a new profile");
  }
};
