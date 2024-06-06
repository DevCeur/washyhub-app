import { json, redirect } from "@remix-run/node";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";

import { verifyToken } from "~/services/password-reset-token";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./route.module.css";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const url = new URL(request.url);

      const token = url.searchParams.get("token");

      if (!token) {
        return redirect(ROUTE.RECOVER_PASSWORD);
      }

      const verificationResult = await verifyToken({ token });

      if (verificationResult.errors) {
        return json({ errors: verificationResult.errors });
      }

      return verificationResult;
    },
  });

export const action: ActionFunction = async () => {};

export default function ChangePasswordRoute() {
  const navigation = useNavigation();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const loaderDataErrors = loaderData?.errors;
  const actionDataErrors = actionData?.errors;

  const isTokenValid = loaderData?.isValid;

  const isLoading = navigation.formAction === "/change-password";

  return (
    <div className={styles.container}>
      {!isTokenValid && <RiErrorWarningLine className={styles.error_icon} />}

      <div className={styles.heading}>
        <h1>{isTokenValid ? "Create New Password" : "Your token is invalid"}</h1>

        {loaderDataErrors?.server && <span>{loaderDataErrors?.server}</span>}
      </div>

      {!isTokenValid && (
        <Link to={ROUTE.RECOVER_PASSWORD}>Recover my password again</Link>
      )}

      {isTokenValid && (
        <Form action="/change-password" method="post" className={styles.form}>
          <fieldset disabled={isLoading} className={styles.fields_container}>
            <TextInput
              label="New Password"
              type="password"
              name="new_password"
              error={actionDataErrors?.new_password}
            />

            <TextInput
              label="Confirm Password"
              type="password"
              name="confirm_password"
              error={actionDataErrors?.confirm_password}
            />
          </fieldset>

          <Button colorScheme="brand" loading={isLoading}>
            Reset Password
          </Button>

          {actionDataErrors?.server && (
            <span className={styles.server_error}>{actionDataErrors.server}</span>
          )}
        </Form>
      )}
    </div>
  );
}
