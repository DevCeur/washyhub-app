import { z } from "zod";
import { json } from "@remix-run/node";
import { useForm } from "react-hook-form";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";

import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import {
  destroySession,
  getCurrentCarwashId,
  getCurrentCarwashSession,
} from "~/utils/sessions/current-carwash-session";

import {
  deleteCarwash,
  getAllUserCarwashes,
  getCarwashById,
  updateCarwash,
} from "~/services/carwash";

import { TextInput } from "~/components/text-input";
import { UpdateForm } from "~/components/update-form";
import { MessageCard } from "~/components/message-card";
import { UpdateFormSection } from "~/components/update-form-section";

import styles from "./route.module.css";
import { DeleteCarwashModal } from "~/components/modals/delete-carwash-modal";

interface LoaderData {
  carwash: CarwashWithOwnerServicesAndPackages;
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { carwashId } = params;

      const { carwash } = await getCarwashById({
        id: carwashId as string,
        request,
      });

      const { carwashes } = await getAllUserCarwashes({ request });

      return json({ carwash, carwashes });
    },
  });

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.carwash?.name} - Settings` }];
};

export const action: ActionFunction = async ({ request, params }) => {
  const { carwashId: id } = params;

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

      // eslint-disable-next-line no-case-declarations
      const { carwash } = await updateCarwash({
        id: id as string,
        request,
        data: validatedFormData,
      });

      return json({ carwash });

    case "DELETE":
      if (id === carwashId) {
        await deleteCarwash({ id: id as string, request });

        currentCarwashSession.unset("carwashId");

        return redirect(ROUTE.CARWASHES, {
          headers: {
            "Set-Cookie": await destroySession(currentCarwashSession),
          },
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

  const { carwash, carwashes } = useLoaderData<LoaderData>();

  const disableDelete = carwashes.length === 1;

  const actionData = fetcher.data;

  const form = useForm({
    defaultValues: { carwash_name: carwash.name },
  });

  const isSavingLoading =
    (fetcher.state === "submitting" || fetcher.state === "loading") &&
    fetcher.formMethod === "POST";

  return (
    <div className={styles.container}>
      <UpdateForm isLoading={isSavingLoading} method="POST" fetcher={fetcher} form={form}>
        <UpdateFormSection title="Carwash Info">
          <TextInput
            label="Carwash Name"
            error={actionData?.errors?.carwash_name}
            {...form.register("carwash_name")}
          />
        </UpdateFormSection>
      </UpdateForm>

      <MessageCard
        type="danger"
        title="Delete this Carwash"
        message={
          disableDelete
            ? "You must have at least 1 Carwash, you'll not be able to delete this carwash"
            : "Deleting this Carwash will also remove all services, packages and orders related."
        }
      >
        <div style={{ paddingTop: 8 }}>
          <DeleteCarwashModal
            carwash={carwash as unknown as CarwashWithOwnerServicesAndPackages}
            disableDelete={disableDelete}
          />
        </div>
      </MessageCard>
    </div>
  );
}
