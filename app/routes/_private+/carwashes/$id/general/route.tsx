import { z } from "zod";
import { json } from "@remix-run/node";
import { useForm } from "react-hook-form";
import { Form, redirect, useFetcher, useLoaderData } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import {
  destroySession,
  getCurrentCarwashId,
  getCurrentCarwashSession,
} from "~/utils/sessions/current-carwash-session";

import { deleteCarwash, getCarwashById, updateCarwash } from "~/services/carwash";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";
import { UpdateForm } from "~/components/update-form";
import { MessageCard } from "~/components/message-card";
import { UpdateFormSection } from "~/components/update-form-section";

import styles from "./route.module.css";

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

  const { currentCarwashSession } = await getCurrentCarwashSession({ request });
  const { carwashId } = await getCurrentCarwashId({ request });

  const formData = Object.fromEntries(await request.formData());

  const formSchema = z.object({
    carwash_name: z
      .string()
      .min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD })
      .max(255, { message: "This name is too long." }),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  switch (request.method) {
    case "POST":
      if (formValidationError) {
        return json({ errors: formValidationError.flatten().fieldErrors });
      }

      await updateCarwash({
        id: id as string,
        request,
        data: validatedFormData,
      });

      return json({ success: true });

    case "DELETE":
      if (id === carwashId) {
        await deleteCarwash({ id: id as string, request });

        currentCarwashSession.unset("carwashId");

        return redirect(ROUTE.CARWASHES, {
          headers: { "Set-Cookie": await destroySession(currentCarwashSession) },
        });
      }

      await deleteCarwash({ id: id as string, request });

      return redirect(ROUTE.CARWASHES);

    default:
      return json({ success: true });
  }
};

export default function CarwashGeneralSettingsRoute() {
  const fetcher = useFetcher<typeof action>();

  const { carwash } = useLoaderData<LoaderData>();

  const form = useForm({
    defaultValues: { carwash_name: carwash.name },
  });

  const actionData = fetcher.data;
  const isLoading = fetcher.state === "submitting";

  return (
    <div className={styles.container}>
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

      <MessageCard
        type="danger"
        title="Delete this Carwash"
        message="Deleting this Carwash will also remove all services, packages and orders related."
      >
        <Form method="delete" className={styles.form}>
          <Button
            size="small"
            loading={isLoading}
            variant="error"
            hierarchy="secondary"
            overlay
          >
            Delete Carwash
          </Button>
        </Form>
      </MessageCard>
    </div>
  );
}
