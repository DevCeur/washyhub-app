import { useState } from "react";
import { Form } from "@remix-run/react";

import { FaRegTrashCan } from "react-icons/fa6";

import type { CarwashService } from "@prisma/client";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";

import styles from "./delete-service-modal.module.css";

interface DeleteServiceModalProps {
  variant: "card" | "page";
  service: CarwashService;
}

export const DeleteServiceModal = ({ variant, service }: DeleteServiceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        size="small"
        variant="error"
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

          <Form method="delete" navigate={false} className={styles.form}>
            <input type="hidden" name="serviceId" value={service.id} />

            <Button
              variant="error"
              size="small"
              type="submit"
              name="intent"
              value="delete"
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
          </Form>
        </div>
      </Modal>
    </>
  );
};
