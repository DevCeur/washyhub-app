import { prisma } from "~/lib/database/database";

interface GetServiceById {
  id: string;
}

export const getServiceById = async ({ id }: GetServiceById) => {
  try {
    const service = await prisma.carwashService.findUnique({
      where: { id },
      include: { carwash: true },
    });

    return { service };
  } catch (error) {
    throw new Error("Error getting service by id");
  }
};

interface CreateCarwashService {
  data: {
    service_name: string;
    service_cost: number;
    service_description: string;
    carwash_id: string;
  };
}

export const createCarwashService = async ({ data }: CreateCarwashService) => {
  try {
    const service = await prisma.carwashService.create({
      data: {
        name: data.service_name,
        cost: data.service_cost,
        description: data.service_description,
        carwash_id: data.carwash_id,
      },
    });

    return { service };
  } catch (error) {
    throw new Error("There was an error creating a carwash service");
  }
};

interface UpdateCarwashService {
  serviceId: string;
  data: {
    service_name: string;
    service_cost: number;
    service_description: string;
    carwash_id: string;
  };
}

export const updateCarwashService = async ({
  serviceId,
  data,
}: UpdateCarwashService) => {
  try {
    const service = await prisma.carwashService.update({
      where: { id: serviceId },
      data: {
        name: data.service_name,
        cost: data.service_cost,
        description: data.service_description,
        carwash_id: data.carwash_id,
      },
    });

    return { service };
  } catch (error) {
    console.log(error);

    throw new Error("There was an error updating this carwash service");
  }
};

interface DeleteCarwashService {
  service_id: string;
}

interface DeleteCarwashService {
  service_id: string;
}

export const deleteCarwashService = async ({
  service_id,
}: DeleteCarwashService) => {
  try {
    await prisma.carwashService.delete({ where: { id: service_id } });
  } catch (error) {
    throw new Error("There was an error creating a carwash service");
  }
};
