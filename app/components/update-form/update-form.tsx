import { FieldValues, UseFormReturn } from "react-hook-form";

import type { FetcherWithComponents, FormProps } from "@remix-run/react";

import { Button } from "../button";

import styles from "./update-form.module.css";

interface UpdateFormProps<T, TFieldValues> extends FormProps {
  children: React.ReactNode;
  fetcher: FetcherWithComponents<T>;
  form: UseFormReturn<TFieldValues & FieldValues>;
}

export const UpdateForm = <T, TFieldValues>({
  fetcher,
  children,
  form,
  ...formProps
}: UpdateFormProps<T, TFieldValues>) => {
  const { Form, state } = fetcher;

  const isLoading = state === "submitting";

  const { formState, reset } = form;

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    reset();
  };

  return (
    <Form {...formProps} className={styles.container}>
      <div className={styles.content}>{children}</div>

      <div className={styles.actions_container}>
        <Button
          onClick={handleCancel}
          disabled={!formState.isDirty}
          size="small"
          hierarchy="secondary"
        >
          Cancel
        </Button>

        <Button disabled={!formState.isDirty} size="small" loading={isLoading}>
          Save
        </Button>
      </div>
    </Form>
  );
};
