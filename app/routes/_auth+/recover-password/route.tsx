import { Link, Form, useActionData, useNavigation } from "@remix-run/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import type { ActionFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";

import { TextInput } from "~/components/text-input";

import { Button } from "~/components/button";

import styles from "./route.module.css";

export const action: ActionFunction = async () => {};

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
