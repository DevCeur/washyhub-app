import { z } from "zod";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { createCarwash, getCarwashById, updateCarwash } from "~/services/carwash";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const formSchema = z.object({
    carwash_name: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),

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

  const { carwash } = await getCarwashById({
    request,
    id: (formData.carwash_id as string) || "",
  });

  if (carwash) {
    await updateCarwash({
      request,
      id: carwash.id,
      data: validatedFormData,
    });
  }

  if (!carwash) {
    await createCarwash({ request, data: validatedFormData });
  }

  return redirect(`${ROUTE.ONBOARDING}?step=${currentStep + 1}`);
};
