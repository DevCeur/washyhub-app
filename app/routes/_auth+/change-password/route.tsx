import { Form, useActionData, useNavigation } from "@remix-run/react";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import type { ActionFunction, LoaderFunction } from "@remix-run/node";

import { TextInput } from "~/components/text-input";

import { Button } from "~/components/button";

import styles from "./route.module.css";

export const loader: LoaderFunction = async () => {};

export const action: ActionFunction = async () => {};

export default function ResetPasswordRoute() {
  const navigation = useNavigation();
  const actionData = useActionData<typeof action>();

  const errors = actionData?.errors;
  const isEmailSent = actionData?.success;

  const isLoading = navigation.formAction === "/recover-password";

  return (
    <div className={styles.container}>
      {isEmailSent && <IoIosCheckmarkCircleOutline className={styles.success_icon} />}

      <div className={styles.heading}>
        <h1>{isEmailSent ? "Password Updated!" : "Create New Password"}</h1>
      </div>

      {!isEmailSent && (
        <Form action="/change-password" method="post" className={styles.form}>
          <fieldset disabled={isLoading} className={styles.fields_container}>
            <TextInput
              label="New Password"
              type="password"
              name="new_password"
              error={errors?.new_password}
            />

            <TextInput
              label="Confirm Password"
              type="password"
              name="confirm_password"
              error={errors?.confirm_password}
            />
          </fieldset>

          <Button colorScheme="brand" loading={isLoading}>
            Reset Password
          </Button>

          {errors?.server && <span className={styles.server_error}>{errors.server}</span>}
        </Form>
      )}
    </div>
  );
}
