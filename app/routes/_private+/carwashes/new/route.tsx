import { z } from "zod";
import { redirect, useNavigation } from "react-router";
import { Form, json, useActionData, useNavigate } from "@remix-run/react";

import { IoIosArrowRoundBack } from "react-icons/io";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { createCarwash } from "~/services/carwash";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./new.module.css";

export const loader: LoaderFunction = (loaderArgs) => withAuthLoader({ loaderArgs });

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const formSchema = z.object({
    carwashName: z
      .string()
      .min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD })
      .max(250, { message: "Carwash name it's too long." }),
  });

  const { error: formValidationError, data: validatedFormData } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  const { carwash } = await createCarwash({
    data: { carwash_name: validatedFormData.carwashName },
    request,
  });

  return redirect(`${ROUTE.CARWASHES}/${carwash.id}`);
};

export default function NewCarwashRoute() {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const isLoading = navigation.formAction === "/carwashes/new";

  const errors = actionData?.errors;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>Create new Carwash</h1>
          <p>
            This is a new Carwash, you will need to setup new Services and Packages later.
          </p>
        </div>

        <Form action="/carwashes/new" method="post" className={styles.form}>
          <TextInput
            label="Carwash Name"
            name="carwashName"
            placeholder="My Carwash"
            hint="You can update this later."
            error={errors?.carwashName}
          />

          <Button loading={isLoading}>Create Carwash</Button>
        </Form>
      </div>

      <Button
        icon={IoIosArrowRoundBack}
        onClick={() => navigate(-1)}
        hierarchy="tertiary"
        size="small"
      >
        Go Back
      </Button>
    </div>
  );
}
