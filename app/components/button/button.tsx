import { cva } from "class-variance-authority";
import { FiLoader } from "react-icons/fi";

import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import styles from "./button.module.css";

const buttonStyles = cva(styles.base_button, {
  variants: {
    hierarchy: {
      primary: styles.button_primary,

      secondary: styles.button_secondary,

      tertiary: styles.button_tertiary,
    },

    variant: {
      brand: styles.button_brand,

      default: styles.button_default,

      error: styles.button_error,
    },

    size: {
      small: styles.button_small,

      default: styles.button_medium,

      large: styles.button_large,
    },
  },

  defaultVariants: {
    hierarchy: "primary",
    variant: "default",
    size: "default",
  },
});

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  children: React.ReactNode;
  loading?: boolean;
}

export const Button = ({
  children,
  variant,
  hierarchy,
  size,
  loading,
  ...buttonProps
}: ButtonProps) => {
  return (
    <button
      disabled={loading}
      className={buttonStyles({ variant, size, hierarchy })}
      {...buttonProps}
    >
      <span>{children}</span>

      {loading && <FiLoader className={styles.spinner} />}
    </button>
  );
};
