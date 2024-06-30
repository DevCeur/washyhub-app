import { z } from "zod";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { HiArrowSmallLeft } from "react-icons/hi2";

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
import { SuccessMessage } from "~/components/success-message";

import styles from "./route.module.css";

export const loader: LoaderFunction = async (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const url = new URL(request.url);

      const { resetPasswordSession } = await getResetPasswordSession({
        request,
      });

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
          {
            headers: {
              "Set-Cookie": await destroySession(resetPasswordSession),
            },
          }
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

  const loaderData = useLoaderData<typeof loader>();

  const actionDataErrors = fetcher.data?.errors;

  const isTokenValid = loaderData?.isValid;
  const isPasswordUpdated = fetcher.data?.success;

  const isLoading = fetcher.formAction === "/change-password";

  return (
    <div className={styles.container}>
      {!isTokenValid && !isPasswordUpdated && (
        <div className={styles.invalid_token_container}>
          <div className={styles.invalid_token_message}>
            <span>
              Your reset password token is not valid anymore, it could be
              expired or already used. to generate a new token go back to{" "}
              <Link to={ROUTE.RECOVER_PASSWORD}>recover your password</Link> and
              resend an instruction email.
            </span>
          </div>

          <Link to={ROUTE.SIGN_IN} className={styles.redirection_link}>
            <HiArrowSmallLeft />
            Return to Sign In
          </Link>
        </div>
      )}

      {isPasswordUpdated && (
        <div className={styles.success_message_container}>
          <SuccessMessage message="Your password has been updated successfully" />

          <Link to={ROUTE.SIGN_IN} className={styles.redirection_link}>
            <HiArrowSmallLeft />
            Return to Sign In
          </Link>
        </div>
      )}

      {isTokenValid && !isPasswordUpdated && (
        <fetcher.Form
          action="/change-password"
          method="post"
          className={styles.form}
        >
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

          <Button loading={isLoading} size="medium">
            Reset Password
          </Button>

          {actionDataErrors?.server && (
            <span className={styles.server_error}>
              {actionDataErrors.server}
            </span>
          )}
        </fetcher.Form>
      )}
    </div>
  );
}
