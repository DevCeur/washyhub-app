import { z } from "zod";
import { json } from "@remix-run/node";
import { useForm } from "react-hook-form";
import { useFetcher, useLoaderData } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ERROR_MESSAGE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getCarwashById, updateCarwash } from "~/services/carwash";

import { TextInput } from "~/components/text-input";
import { UpdateForm } from "~/components/update-form";
import { UpdateFormSection } from "~/components/update-form-section";

interface LoaderData {
  carwash: CarwashWithOwnerServicesAndPackages;
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { id } = params;

      const { carwash } = await getCarwashById({ id: id as string, request });

      return json({ carwash });
    },
  });

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = params;

  const formData = Object.fromEntries(await request.formData());

  const formSchema = z.object({
    carwash_name: z
      .string()
      .min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD })
      .max(255, { message: "This name is too long." }),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  await updateCarwash({
    id: id as string,
    request,
    data: validatedFormData,
  });

  return json({ success: true });
};

export default function CarwashGeneralSettingsRoute() {
  const fetcher = useFetcher<typeof action>();

  const { carwash } = useLoaderData<LoaderData>();

  const form = useForm({
    defaultValues: { carwash_name: carwash.name },
  });

  const actionData = fetcher.data;

  return (
    <UpdateForm method="post" fetcher={fetcher} form={form}>
      <UpdateFormSection title="Carwash Info">
        <TextInput
          label="Carwash Name"
          defaultValue={carwash.name}
          error={actionData?.errors?.carwash_name}
          {...form.register("carwash_name")}
        />
      </UpdateFormSection>
    </UpdateForm>
  );
}
