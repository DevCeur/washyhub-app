import { z } from "zod";
import { json } from "@remix-run/node";

import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";

import { createSupabaseServerClient } from "~/lib/supabase/supabase-client.server";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./route.module.css";

export const action: ActionFunction = async ({ request }) => {
  const { supabase, headers } = createSupabaseServerClient({ request });

  const formData = Object.fromEntries(await request.formData());

  const userSchema = z.object({
    email: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .email({ message: ERROR_MESSAGE.INVALID_EMAIL }),

    password: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .min(6, ERROR_MESSAGE.SHORT_PASSWORD),
  });

  const { data: validatedForm, error: formValidationError } =
    userSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  const { error: signUpError } = await supabase.auth.signUp({
    email: validatedForm.email,
    password: validatedForm.password,
  });

  if (signUpError) {
    if (signUpError.code === "user_already_exists") {
      return json({ errors: { email: "This email is already registered" } });
    }

    return json({
      errors: { server: "There was an error creating your user. please try again later" },
    });
  }

  return json({ errors: null }, { headers });
};

export default function SignUpRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors;

  const isLoading = navigation.formAction === "/sign-up";

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Create Account</h1>
        <span>Create an account and start managing your carwash</span>
      </div>

      <Form action="/sign-up" method="post" className={styles.form}>
        <fieldset disabled={isLoading} className={styles.fields_container}>
          <TextInput label="Email" type="email" name="email" error={errors?.email} />

          <TextInput
            label="Password"
            type="password"
            name="password"
            placeholder="+6 characters"
            error={errors?.password}
          />
        </fieldset>

        <span className={styles.account_agreement}>
          Your information is kept safe and confidential. By proceeding, you agree to
          Carwash <Link to={ROUTE.HOME}>Terms of Service</Link> and{" "}
          <Link to={ROUTE.HOME}>Privacy Policy.</Link>
        </span>

        <Button colorScheme="brand" loading={isLoading}>
          Create Account
        </Button>

        {errors?.server && <span className={styles.server_error}>{errors.server}</span>}
      </Form>

      <Link to={ROUTE.SIGN_IN} className={styles.sign_redirection_link}>
        Already have an account? Sign in
      </Link>
    </div>
  );
}
