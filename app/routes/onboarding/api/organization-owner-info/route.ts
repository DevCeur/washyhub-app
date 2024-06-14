import { z } from "zod";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { getUserId } from "~/utils/sessions/auth-session";

import {
  createUserProfile,
  getUserProfileById,
  updateUserProfile,
} from "~/services/profile";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const { userId } = await getUserId({ request });

  const formSchema = z.object({
    first_name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),
    last_name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),

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

  const { profile } = await getUserProfileById({ userId });

  if (
    profile &&
    profile.first_name !== validatedFormData.first_name &&
    profile.last_name !== validatedFormData.last_name
  ) {
    await updateUserProfile({ userId, data: validatedFormData });
  }

  if (!profile) {
    await createUserProfile({ userId, data: validatedFormData });
  }

  return redirect(`${ROUTE.ONBOARDING}?step=${currentStep + 1}`);
};
