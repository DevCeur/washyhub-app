import { z } from "zod";
import { json, redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { createCarwash, getCarwashById, updateCarwash } from "~/services/carwash";
import {
  commitSession,
  getCurrentCarwashSession,
} from "~/utils/sessions/current-carwash-session";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const { currentCarwashSession } = await getCurrentCarwashSession({ request });

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

  currentCarwashSession.set("carwashId", carwash?.id);

  if (!carwash) {
    const { carwash } = await createCarwash({ request, data: validatedFormData });

    currentCarwashSession.set("carwashId", carwash?.id);
  }

  return redirect(`${ROUTE.ONBOARDING}?step=${currentStep + 1}`, {
    headers: { "Set-Cookie": await commitSession(currentCarwashSession) },
  });
};
