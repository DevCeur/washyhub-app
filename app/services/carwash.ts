import { prisma } from "~/lib/database/database";

import { getAuthUser } from "./user";
import { getCurrentCarwashId } from "~/utils/sessions/current-carwash-session";

interface GetAllUserCarwashesOptions {
  request: Request;
}

export const getAllUserCarwashes = async ({ request }: GetAllUserCarwashesOptions) => {
  try {
    const { user } = await getAuthUser({ request });

    const carwashes = await prisma.carwash.findMany({
      where: { owner_id: user?.id },
      include: { owner: { include: { profile: true } }, packages: true, services: true },
    });

    return { carwashes };
  } catch (error) {
    throw new Error("Error getting all users carwashes");
  }
};

interface GetCarwashByIdOptions {
  id: string;
  request: Request;
}

export const getCarwashById = async ({ id, request }: GetCarwashByIdOptions) => {
  try {
    const { user } = await getAuthUser({ request });

    const carwash = await prisma.carwash.findUnique({
      where: { id, owner_id: user?.id },
      include: { services: true, packages: true },
    });

    return { carwash };
  } catch (error) {
    throw new Error(`Error getting carwash by id: ${id}`);
  }
};

interface GetCurrentCarwashOptions {
  request: Request;
}

export const getCurrentCarwash = async ({ request }: GetCurrentCarwashOptions) => {
  try {
    const { carwashId } = await getCurrentCarwashId({ request });

    const { user } = await getAuthUser({ request });

    if (!carwashId) {
      const { carwashes } = await getAllUserCarwashes({ request });

      return { carwash: carwashes[0] };
    }

    const carwash = await prisma.carwash.findUnique({
      where: { id: carwashId, owner_id: user?.id },
    });

    return { carwash };
  } catch (error) {
    throw new Error(`Error getting current carwash`);
  }
};

interface CreateCarwshOptions {
  request: Request;
  data: {
    carwash_name: string;
  };
}

export const createCarwash = async ({ data, request }: CreateCarwshOptions) => {
  try {
    const { user } = await getAuthUser({ request });

    const newCarwash = await prisma.carwash.create({
      data: { name: data.carwash_name, owner_id: user?.id as string },
    });

    return { carwash: newCarwash };
  } catch (error) {
    throw new Error("Error creating a new carwash");
  }
};

interface UpdateCarwashOptions {
  id: string;
  request: Request;

  data: {
    carwash_name?: string;
  };
}

export const updateCarwash = async ({ id, request, data }: UpdateCarwashOptions) => {
  try {
    const { user } = await getAuthUser({ request });

    const carwashUpdated = await prisma.carwash.update({
      data: { name: data.carwash_name },
      where: { id, owner_id: user?.id },
    });

    return { carwash: carwashUpdated };
  } catch (error) {
    throw new Error(`Error updating carwash with id: ${id}`);
  }
};
