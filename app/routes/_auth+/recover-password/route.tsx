import crypto from "node:crypto";

import { z } from "zod";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import { HiArrowSmallLeft } from "react-icons/hi2";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";
import { ResetPasswordEmail } from "~/utils/emails/reset-password-email";

import { resend } from "~/lib/resend/resend";

import { getUserByEmail } from "~/services/user";
import { saveToken } from "~/services/password-reset-token";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";
import { SuccessMessage } from "~/components/success-message/success-message";

import styles from "./route.module.css";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const url = new URL(request.url);

  const formSchema = z.object({
    email: z
      .string({ message: ERROR_MESSAGE.REQUIRED_FIELD })
      .email({ message: ERROR_MESSAGE.INVALID_EMAIL }),
  });

  const { data: validatedFormData, error: formValidationError } =
    formSchema.safeParse(formData);

  if (formValidationError) {
    return json({ errors: formValidationError.flatten().fieldErrors });
  }

  const { user } = await getUserByEmail({
    email: validatedFormData.email,
  });

  const token = crypto.randomBytes(64).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  if (user) {
    const { success, errors: errorSavingToken } = await saveToken({
      token: hashedToken,
      userId: user.id,
    });

    if (errorSavingToken) {
      return json({ errors: errorSavingToken });
    }

    if (success) {
      const redirectionUrl = `${url.origin}${ROUTE.CHANGE_PASSWORD}?token=${token}`;

      const { error: sendEmailError } = await resend.emails.send({
        from: "WashyHub <no-reply@washyhub.com>",
        to: [user.email],
        subject: "Reset your Password - WashyHub",
        react: ResetPasswordEmail({ redirectionUrl }),
      });

      if (sendEmailError) {
        throw new Error("Error seding reset password email.");
      }
    }
  }

  return json({ success: true, userEmail: user?.email });
};

export default function RecoverPasswordRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors;

  const isEmailSent = actionData?.success;
  const userEmail = actionData?.userEmail;
  const isLoading = navigation.formAction === "/recover-password";

  return (
    <div className={styles.container}>
      {isEmailSent ? (
        <div className={styles.success_message_container}>
          <SuccessMessage message={`We've sent an email to ${userEmail}`} />

          <Link to={ROUTE.SIGN_IN} className={styles.redirection_link}>
            <HiArrowSmallLeft />
            Return to Sign In
          </Link>
        </div>
      ) : (
        <Form action="/recover-password" method="post" className={styles.form}>
          <fieldset disabled={isLoading} className={styles.fields_container}>
            <TextInput
              label="Email"
              type="email"
              name="email"
              placeholder="mariecurie@email.com"
              error={errors?.email}
            />
          </fieldset>

          <Button loading={isLoading}>Recover Password</Button>

          {errors?.server && <span className={styles.server_error}>{errors.server}</span>}
        </Form>
      )}
    </div>
  );
}
