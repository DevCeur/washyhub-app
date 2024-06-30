import { useState } from "react";
import { Form } from "@remix-run/react";

import { FiPlus } from "react-icons/fi";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";
import { TextInput } from "~/components/text-input";

interface CreatePackageModalProps {
  variant: "primary" | "secondary";
}

export const CreatePackageModal = ({ variant }: CreatePackageModalProps) => {
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
        size={variant === "primary" ? "medium" : "small"}
        onClick={handleOpen}
      >
        Create Package
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        position="right"
        title="Create New Package"
        description="With this package you'll be able to optimize your flow!"
      >
        <Form>
          <TextInput
            name="service_name"
            label="Service Name"
            placeholder="Example: General Cleaning"
            hint="You can change this later."
          />

          <TextInput
            name="service_description"
            label="Service Description"
            placeholder="Simple exterior and interior car cleaning"
            hint="You can change this later."
          />
        </Form>
      </Modal>
    </>
  );
};
