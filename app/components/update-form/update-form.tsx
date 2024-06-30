import { FieldValues, UseFormReturn } from "react-hook-form";

import type { FetcherWithComponents, FormProps } from "@remix-run/react";

import { Button } from "../button";

import styles from "./update-form.module.css";

interface UpdateFormProps<T, TFieldValues> extends FormProps {
  children: React.ReactNode;
  isLoading?: boolean;
  fetcher: FetcherWithComponents<T>;
  form: UseFormReturn<TFieldValues & FieldValues>;
}

export const UpdateForm = <T, TFieldValues>({
  form,
  fetcher,
  children,
  isLoading,
  ...formProps
}: UpdateFormProps<T, TFieldValues>) => {
  const { Form, state } = fetcher;
  const { formState, reset } = form;

  const loading = isLoading || state === "submitting" || state === "loading";
  const disabled = !formState.isDirty;

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
          disabled={disabled}
          size="small"
          hierarchy="secondary"
        >
          Cancel
        </Button>

        <Button disabled={disabled} size="small" loading={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
};
