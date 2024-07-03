import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, useNavigation } from "@remix-run/react";

import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { Button } from "~/components/button";
import { Modal } from "~/components/modal";
import { TextInput } from "~/components/text-input";

import styles from "./delete-carwash-modal.module.css";

interface DeleteCarwashModalProps {
  disableDelete: boolean;
  carwash: CarwashWithOwnerServicesAndPackages;
}

export const DeleteCarwashModal = ({
  carwash,
  disableDelete,
}: DeleteCarwashModalProps) => {
  const navigation = useNavigation();

  const { register, watch, resetField } = useForm<{ carwash_name: string }>({
    mode: "onBlur",
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    resetField("carwash_name");
  };

  const handleClose = () => {
    setIsOpen(false);
    resetField("carwash_name");
  };

  const formAction = `${ROUTE.CARWASHES}/${carwash.id}/general`;

  const isLoading =
    (navigation.state === "submitting" || navigation.state === "loading") &&
    navigation.formMethod === "DELETE";

  const watchCarwashName = watch("carwash_name");

  return (
    <>
      <Button
        overlay
        size="small"
        variant="danger"
        hierarchy="secondary"
        loading={isLoading}
        disabled={disableDelete}
        onClick={handleOpen}
      >
        Delete Carwash
      </Button>

      <Modal
        isOpen={isOpen}
        position="center"
        title={`Delete Carwash: ${carwash.name}`}
        onClose={handleClose}
      >
        <div className={styles.container}>
          <p className={styles.message}>
            This action <strong>cannot be undone.</strong> This will permanently delete
            the <strong>{carwash.name}</strong> carwash and remove all of its services,
            packages and orders.
          </p>

          <Form method="DELETE" action={formAction} className={styles.form}>
            <fieldset className={styles.form_fields}>
              <TextInput
                label={`Please type ${carwash.name} to confirm`}
                placeholder="Enter carwash name"
                {...register("carwash_name", {
                  validate: {
                    matchesCarwashName: (value) => {
                      return (
                        value === carwash.name ||
                        "Name entered does not match the carwash name above."
                      );
                    },
                  },
                })}
              />
            </fieldset>

            <div className={styles.form_buttons}>
              <Button
                variant="danger"
                size="small"
                type="submit"
                name="carwash_id"
                value={carwash.id}
                loading={isLoading}
                disabled={watchCarwashName !== carwash.name}
              >
                I understand, delete carwash
              </Button>

              <Button
                size="small"
                hierarchy="secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsOpen(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};
