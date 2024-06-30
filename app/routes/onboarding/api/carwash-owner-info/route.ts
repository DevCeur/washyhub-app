import { z } from "zod";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { createUserProfile, getUserProfile, updateUserProfile } from "~/services/profile";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const formSchema = z.object({
    first_name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),
    last_name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),

    current_step: z.string(),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  if (!validatedFormData || !validatedFormData.current_step) {
    return redirect(ROUTE.ONBOARDING);
  }

  const currentStep = parseInt(validatedFormData.current_step);

  const { profile } = await getUserProfile({ request });

  if (profile) {
    await updateUserProfile({ request, data: validatedFormData });
  }

  if (!profile) {
    await createUserProfile({ request, data: validatedFormData });
  }

  return redirect(`${ROUTE.ONBOARDING}?step=${currentStep + 1}`);
};
