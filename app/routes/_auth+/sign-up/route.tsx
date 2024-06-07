import { z } from "zod";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { ERROR_MESSAGE } from "~/utils/enum";

import { createHash } from "~/utils/hash";
import { withAuthLoader } from "~/utils/with-auth-loader";
import { commitSession, getAuthSession } from "~/utils/sessions/auth-session";

import { createNewUser } from "~/services/user";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./route.module.css";

export const loader: LoaderFunction = (loaderArgs) => withAuthLoader({ loaderArgs });

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const { authSession } = await getAuthSession({ request });

  const formSchema = z.object({
    email: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .email({ message: ERROR_MESSAGE.INVALID_EMAIL }),

    password: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .min(6, { message: ERROR_MESSAGE.SHORT_PASSWORD }),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  const { hash: hashedPassword } = await createHash({ text: validatedFormData.password });

  const { user, errors: creatingUserError } = await createNewUser({
    data: { email: validatedFormData.email, password: hashedPassword },
  });

  if (creatingUserError) {
    return json({ errors: creatingUserError });
  }

  authSession.set("userId", user?.id);

  return json(
    { success: true },
    { headers: { "Set-Cookie": await commitSession(authSession) } }
  );
};

export default function SignUpRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors;

  const isLoading = navigation.formAction === "/sign-up";

  return (
    <div className={styles.container}>
      <Form action="/sign-up" method="post" className={styles.form}>
        <fieldset disabled={isLoading} className={styles.fields_container}>
          <TextInput
            label="Email"
            type="email"
            name="email"
            placeholder="mariecurie@email.com"
            error={errors?.email}
          />

          <TextInput
            label="Password"
            type="password"
            name="password"
            placeholder="+6 characters"
            error={errors?.password}
          />
        </fieldset>

        <Button colorScheme="brand" loading={isLoading}>
          Create Account
        </Button>

        {errors?.server && <span className={styles.server_error}>{errors.server}</span>}
      </Form>
    </div>
  );
}
