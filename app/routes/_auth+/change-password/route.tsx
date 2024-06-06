import { z } from "zod";
import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { RiErrorWarningLine } from "react-icons/ri";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import {
  commitSession,
  destroySession,
  getResetPasswordSession,
  getUserId,
} from "~/utils/sessions/reset-password-session";
import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";

import { updateUserPassword } from "~/services/user";
import { verifyToken } from "~/services/password-reset-token";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./route.module.css";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const url = new URL(request.url);

      const { resetPasswordSession } = await getResetPasswordSession({ request });

      const token = url.searchParams.get("token");

      if (!token) {
        return redirect(ROUTE.SIGN_IN, {
          headers: { "Set-Cookie": await destroySession(resetPasswordSession) },
        });
      }

      const {
        isValid,
        userId,
        errors: verificationErrors,
      } = await verifyToken({ token });

      if (verificationErrors) {
        return json(
          { errors: verificationErrors },
          { headers: { "Set-Cookie": await destroySession(resetPasswordSession) } }
        );
      }

      resetPasswordSession.set("userId", userId);

      return json(
        { isValid, userId },
        { headers: { "Set-Cookie": await commitSession(resetPasswordSession) } }
      );
    },
  });

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const { resetPasswordSession } = await getResetPasswordSession({ request });

  const { userId } = await getUserId({ request });

  const formSchema = z.object({
    new_password: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .min(6, { message: ERROR_MESSAGE.SHORT_PASSWORD }),

    confirm_password: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .min(6, { message: ERROR_MESSAGE.SHORT_PASSWORD }),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  if (validatedFormData.new_password !== validatedFormData.confirm_password) {
    return {
      errors: {
        new_password: "Password doesn't match",
        confirm_password: "Password doesn't match",
      },
    };
  }

  const { errors: updateUserPasswordError } = await updateUserPassword({
    userId,
    data: {
      newPassword: validatedFormData.new_password,
      confirmPassword: validatedFormData.confirm_password,
    },
  });

  if (updateUserPasswordError) {
    return json({ errors: updateUserPasswordError });
  }

  return json(
    { success: true },
    { headers: { "Set-Cookie": await destroySession(resetPasswordSession) } }
  );
};

export default function ChangePasswordRoute() {
  const fetcher = useFetcher<typeof action>();

  const navigate = useNavigate();

  const loaderData = useLoaderData<typeof loader>();

  const actionDataErrors = fetcher.data?.errors;

  const isTokenValid = loaderData?.isValid;
  const isPasswordUpdated = fetcher.data?.success;

  const isLoading = fetcher.formAction === "/change-password";

  console.log({ loaderData, actionDataErrors });

  return (
    <div className={styles.container}>
      {!isTokenValid && !isPasswordUpdated && (
        <RiErrorWarningLine className={styles.error_icon} />
      )}

      {isPasswordUpdated && (
        <IoIosCheckmarkCircleOutline className={styles.success_icon} />
      )}

      <div className={styles.heading}>
        {isTokenValid && !isPasswordUpdated && (
          <h1>
            {isTokenValid && !isPasswordUpdated
              ? "Create New Password"
              : "Your token is invalid"}
          </h1>
        )}

        {isPasswordUpdated && <h1>Your Password Has Been Updated!</h1>}
      </div>

      {!isTokenValid && !isPasswordUpdated && (
        <Link to={ROUTE.RECOVER_PASSWORD}>Return to Sign In</Link>
      )}

      {isTokenValid && !isPasswordUpdated && (
        <fetcher.Form action="/change-password" method="post" className={styles.form}>
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
        </fetcher.Form>
      )}

      {isPasswordUpdated && (
        <Button onClick={() => navigate(ROUTE.SIGN_IN)}>Return to Sign In</Button>
      )}
    </div>
  );
}
