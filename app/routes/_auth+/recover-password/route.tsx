import crypto from "node:crypto";

import { z } from "zod";
import { json } from "@remix-run/node";
import { Link, Form, useActionData, useNavigation } from "@remix-run/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import type { ActionFunction } from "@remix-run/node";

import { ERROR_MESSAGE, ROUTE } from "~/utils/enum";
import { ResetPasswordEmail } from "~/utils/emails/reset-password-email";

import { resend } from "~/lib/resend/resend";

import { getUserByEmail } from "~/services/user";
import { saveToken } from "~/services/password-reset-token";

import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

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

  return json({ success: true });
};

export default function RecoverPasswordRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors;
  const isEmailSent = actionData?.success;

  const isLoading = navigation.formAction === "/recover-password";

  return (
    <div className={styles.container}>
      {isEmailSent && <IoIosCheckmarkCircleOutline className={styles.success_icon} />}

      <div className={styles.heading}>
        <h1>{isEmailSent ? "Check your Email" : "Recover Password"}</h1>
        <span>
          {isEmailSent
            ? "Check your email inbox and reset your password"
            : "Provide a registred email to reset your password"}
        </span>
      </div>

      {!isEmailSent && (
        <Form action="/recover-password" method="post" className={styles.form}>
          <fieldset disabled={isLoading} className={styles.fields_container}>
            <TextInput label="Email" type="email" name="email" error={errors?.email} />
          </fieldset>

          <Button colorScheme="brand" loading={isLoading}>
            Recover Password
          </Button>

          {errors?.server && <span className={styles.server_error}>{errors.server}</span>}
        </Form>
      )}

      <Link to={ROUTE.SIGN_IN} className={styles.sign_redirection_link}>
        Go Back
      </Link>
    </div>
  );
}
