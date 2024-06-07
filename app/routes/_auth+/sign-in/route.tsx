import { z } from "zod";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { verifyPassword } from "~/utils/hash";
import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";
import { commitSession, getAuthSession } from "~/utils/sessions/auth-session";

import { getUserByEmail } from "~/services/user";

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

  const { user, errors: getUserError } = await getUserByEmail({
    email: validatedFormData.email,
  });

  if (getUserError) {
    return json({ errors: getUserError });
  }

  const { success } = await verifyPassword({
    hash: user?.password as string,
    text: validatedFormData.password,
  });

  if (!success) {
    return json({ errors: { credentials: ERROR_MESSAGE.INVALID_CREDENTIALS } });
  }

  authSession.set("userId", user?.id);

  return redirect(ROUTE.DASHBOARD, {
    headers: { "Set-Cookie": await commitSession(authSession) },
  });
};

export default function SignInRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors;

  const isLoading = navigation.formAction === "/sign-in";

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Sign In</h1>
      </div>

      <Form action="/sign-in" method="post" className={styles.form}>
        <fieldset disabled={isLoading} className={styles.fields_container}>
          <TextInput label="Email" type="email" name="email" error={errors?.email} />

          <TextInput
            label="Password"
            type="password"
            name="password"
            error={errors?.password || errors?.credentials}
          />

          <Link to={ROUTE.RECOVER_PASSWORD} className={styles.recover_password_link}>
            Forgot my password
          </Link>
        </fieldset>

        <Button colorScheme="brand" loading={isLoading}>
          Sign In
        </Button>

        {errors?.server && <span className={styles.server_error}>{errors.server}</span>}
      </Form>

      <Link to={ROUTE.SIGN_UP} className={styles.sign_redirection_link}>
        Don&apos; have an account? Create an account
      </Link>
    </div>
  );
}
