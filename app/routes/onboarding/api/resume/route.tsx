import { z } from "zod";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";

import { getUserId } from "~/utils/sessions/auth-session";
import { updateUser } from "~/services/user";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const formSchema = z.object({
    current_step: z.string(),
  });

  const { userId } = await getUserId({ request });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  if (!validatedFormData || !validatedFormData.current_step) {
    return redirect(ROUTE.ONBOARDING);
  }

  await updateUser({ data: { needs_onboarding: false }, userId });

  return redirect(ROUTE.DASHBOARD);
};
