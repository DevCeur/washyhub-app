import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

import { IoClose } from "react-icons/io5";

import { Button } from "../button";

import styles from "./modal.module.css";

const centerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exiting: { opacity: 0, scale: 0.95 },
};

const rightVariants = {
  hidden: { opacity: 0, translateX: 15 },
  visible: { opacity: 1, translateX: 0 },
  exiting: { opacity: 0, translateX: 15 },
};

interface ModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  position: "center" | "right";
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({
  title,
  description,
  isOpen,
  children,
  position,
  onClose: handleClose,
}: ModalProps) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <Dialog
          static
          open={isOpen}
          onClose={handleClose}
          className={styles.container}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={styles.backdrop}
          />

          <div className={styles.panel} data-position={position}>
            <DialogPanel
              as={motion.div}
              initial="hidden"
              animate="visible"
              exit="exiting"
              transition={{ duration: 0.125 }}
              variants={
                position === "center"
                  ? centerVariants
                  : position === "right"
                  ? rightVariants
                  : {}
              }
              data-position={position}
              className={styles.panel_content}
            >
              <div className={styles.panel_content_header}>
                <div className={styles.panel_content_heading}>
                  <DialogTitle className={styles.modal_title}>
                    {title}
                  </DialogTitle>

                  {description && (
                    <Description className={styles.modal_description}>
                      {description}
                    </Description>
                  )}
                </div>

                <div>
                  <Button
                    icon={IoClose}
                    hierarchy="secondary"
                    onClick={handleClose}
                  />
                </div>
              </div>

              <div className={styles.content}>{children}</div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
