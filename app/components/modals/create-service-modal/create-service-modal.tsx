import { useState } from "react";
import { Form } from "@remix-run/react";

import { FiPlus } from "react-icons/fi";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

import styles from "./create-service-modal.module.css";

interface CreateServiceModalProps {
  variant: "primary" | "secondary";
}

export const CreateServiceModal = ({ variant }: CreateServiceModalProps) => {
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
        icon={FiPlus}
        hierarchy={variant}
        size={variant === "primary" ? "default" : "small"}
        onClick={handleOpen}
      >
        Create Service
      </Button>

      <Modal
        position="right"
        title="Create new service"
        description="Use this service in your orders or add it to a package"
        isOpen={isOpen}
        onClose={handleClose}
      >
        <Form className={styles.form}>
          <fieldset className={styles.form_fields}>
            <TextInput
              name="service_name"
              label="Service Name"
              placeholder="General Cleaning"
            />

            <TextInput
              name="service_description"
              label="Service Description"
              placeholder="Simple exterior and interior Car cleaning"
            />

            <TextInput name="service_cost" label="Service Cost" placeholder="$50.000" />

            <TextInput name="service_cost" label="Service Cost" placeholder="$50.000" />
          </fieldset>
        </Form>
      </Modal>
    </>
  );
};
