import { prisma } from "~/lib/database/database";

interface GetUserOrganizationByIdOptions {
  userId: string;
}

export const getAllUserOrganizations = async ({
  userId,
}: GetUserOrganizationByIdOptions) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: { owner_id: userId },
    });

    return { organizations };
  } catch (error) {
    throw new Error("Error getting all users organization");
  }
};

interface GetOrganizationByIdOptions {
  organizationId: string;
  userId: string;
}

export const getOrganizationById = async ({
  userId,
  organizationId,
}: GetOrganizationByIdOptions) => {
  try {
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId, owner_id: userId },
    });

    return { organization };
  } catch (error) {
    throw new Error("Error getting all users organization");
  }
};

interface CreateUserOrganizationOptions {
  userId: string;

  data: {
    organization_name: string;
  };
}

interface CreateUserOrganizationOptions {
  userId: string;

  data: {
    organization_name: string;
  };
}

export const createUserOrganization = async ({
  data,
  userId,
}: CreateUserOrganizationOptions) => {
  try {
    const organization = await prisma.organization.create({
      data: { name: data.organization_name, owner_id: userId },
    });

    console.log(organization);

    return { organization };
  } catch (error) {
    console.log(error);

    throw new Error("Error creating a new organization");
  }
};

interface UpdateUserOrganizationOptions {
  userId: string;
  organizationId: string;

  data: {
    organization_name?: string;
  };
}

export const updateUserOrganization = async ({
  data,
  organizationId,
  userId,
}: UpdateUserOrganizationOptions) => {
  try {
    const organization = await prisma.organization.update({
      data: { name: data.organization_name },
      where: { id: organizationId, owner_id: userId },
    });

    return { organization };
  } catch (error) {
    throw new Error("Error updating organization");
  }
};
