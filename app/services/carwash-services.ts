import { prisma } from "~/lib/database/database";

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
