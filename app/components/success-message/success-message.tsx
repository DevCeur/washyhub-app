import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import styles from "./success-message.module.css";

interface SuccessMessageProps {
  message: string;
}

export const SuccessMessage = ({ message }: SuccessMessageProps) => {
  return (
    <div className={styles.success_message}>
      <IoIosCheckmarkCircleOutline />

      <span>{message}</span>
    </div>
  );
};
