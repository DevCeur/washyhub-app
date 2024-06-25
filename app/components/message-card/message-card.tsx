import { cva } from "class-variance-authority";

import { TbAlertCircle } from "react-icons/tb";
import { BiErrorAlt } from "react-icons/bi";
import { FaRegCircleCheck } from "react-icons/fa6";

import type { IconType } from "react-icons";
import type { VariantProps } from "class-variance-authority";

import styles from "./message-card.module.css";

const messageCardStyles = cva(styles.container, {
  variants: {
    type: {
      success: styles.success,
      warning: styles.warning,
      danger: styles.danger,
    },
  },

  defaultVariants: {
    type: "success",
  },
});

const ICON_BY_MESSAGE_TYPE = {
  success: FaRegCircleCheck,
  warning: TbAlertCircle,
  danger: BiErrorAlt,
};

interface MessageCardProps extends VariantProps<typeof messageCardStyles> {
  title?: string;
  message?: string;
  icon?: IconType;
  showDefaultIcon?: boolean;
  children?: React.ReactNode;
}

export const MessageCard = ({
  title,
  message,
  icon: Icon,
  showDefaultIcon,
  children,
  type,
}: MessageCardProps) => {
  const DefaultIcon = ICON_BY_MESSAGE_TYPE[type || "success"];

  return (
    <div className={messageCardStyles({ type })}>
      {Icon && showDefaultIcon ? <Icon className={styles.icon} /> : <DefaultIcon />}

      <div className={styles.content}>
        <div className={styles.title_message}>
          {title && <span className={styles.title}>{title}</span>}
          {message && <span className={styles.message}>{message}</span>}
        </div>

        {children}
      </div>
    </div>
  );
};
