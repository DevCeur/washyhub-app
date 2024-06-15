import { z } from "zod";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { getUserId } from "~/utils/sessions/auth-session";

import {
  createUserOrganization,
  getOrganizationById,
  updateUserOrganization,
} from "~/services/organization";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const { userId } = await getUserId({ request });

  const formSchema = z.object({
    organization_name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),

    currentStep: z.string(),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  if (!validatedFormData || !validatedFormData.currentStep) {
    return redirect(ROUTE.ONBOARDING);
  }

  const currentStep = parseInt(validatedFormData.currentStep);

  const { organization } = await getOrganizationById({
    userId,
    organizationId: (formData.organizationId as string) || "",
  });

  if (organization) {
    await updateUserOrganization({
      userId,
      organizationId: organization.id,
      data: validatedFormData,
    });
  }

  if (!organization) {
    await createUserOrganization({ userId, data: validatedFormData });
  }

  return redirect(`${ROUTE.ONBOARDING}?step=${currentStep + 1}`);
};
