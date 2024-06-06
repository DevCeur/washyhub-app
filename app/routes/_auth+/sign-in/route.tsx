import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./route.module.css";

export const loader: LoaderFunction = (loaderArgs) => withAuthLoader({ loaderArgs });

export const action: ActionFunction = async () => {};

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
            error={errors?.password}
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
