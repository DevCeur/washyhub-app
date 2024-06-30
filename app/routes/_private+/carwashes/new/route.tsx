import { z } from "zod";
import { redirect, useNavigation } from "react-router";
import { Form, json, useActionData } from "@remix-run/react";

import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { createCarwash } from "~/services/carwash";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";
import { PageForm } from "~/components/page-form";

import styles from "./route.module.css";

export const loader: LoaderFunction = (loaderArgs) => withAuthLoader({ loaderArgs });

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Create Carwash" }];
};

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

  return redirect(`${ROUTE.CARWASHES}/${carwash.id}/general`);
};

export default function NewCarwashRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const isLoading =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formAction === "/carwashes/new";

  const errors = actionData?.errors;

  return (
    <PageForm
      showGoBack
      title="Create new carwash"
      caption="This is a new Carwash, you will need to setup new Services and Packages later."
    >
      <Form action="/carwashes/new" method="post" className={styles.form}>
        <TextInput
          label="Carwash Name"
          name="carwashName"
          placeholder="My Carwash"
          hint="You can rename your carwash later."
          error={errors?.carwashName}
        />

        <Button loading={isLoading} size="medium">
          Create Carwash
        </Button>
      </Form>
    </PageForm>
  );
}
