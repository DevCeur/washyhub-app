import { useEffect, useState } from "react";
import { useFetcher } from "@remix-run/react";

import { FaRegTrashCan } from "react-icons/fa6";

import type { CarwashServiceWithCarwash } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { action } from "~/routes/_private+/carwashes/$carwashId/services/_index/route";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";

import styles from "./delete-service-modal.module.css";

interface DeleteServiceModalProps {
  variant: "card" | "page";
  service: CarwashServiceWithCarwash;
}

export const DeleteServiceModal = ({ variant, service }: DeleteServiceModalProps) => {
  const fetcher = useFetcher<typeof action>();

  const actionData = fetcher.data;

  const [isOpen, setIsOpen] = useState(false);

  const formAction = `${ROUTE.CARWASHES}/${service.carwash.id}/services`;

  const isLoading =
    (fetcher.state === "submitting" || fetcher.state === "loading") &&
    fetcher.formAction === formAction;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (actionData?.success && !isLoading) {
      setIsOpen(false);
    }
  }, [actionData?.success, isLoading]);

  return (
    <>
      <Button
        size="small"
        variant="danger"
        hierarchy={variant === "card" ? "tertiary" : "secondary"}
        icon={FaRegTrashCan}
        onClick={handleOpen}
      />

      <Modal
        title={`Delete Service: ${service.name}`}
        position="center"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <div className={styles.container}>
          <p className={styles.message}>
            This action cannot be undone. This will permanently delete the {service.name}{" "}
            service.
          </p>

          <fetcher.Form method="DELETE" action={formAction} className={styles.form}>
            <Button
              variant="danger"
              size="small"
              type="submit"
              name="service_id"
              value={service.id}
              loading={isLoading}
            >
              I understand, delete service
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
          </fetcher.Form>
        </div>
      </Modal>
    </>
  );
};
