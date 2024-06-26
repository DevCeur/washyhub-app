import { useState } from "react";

import { FiPlus } from "react-icons/fi";

import { Modal } from "~/components/modal";
import { Button } from "~/components/button";

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
        <p>Hello</p>
      </Modal>
    </>
  );
};
