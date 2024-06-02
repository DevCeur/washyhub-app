import { cva } from "class-variance-authority";
import { FiLoader } from "react-icons/fi";

import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";

import styles from "./button.module.css";

const buttonStyles = cva(styles.base_button, {
  variants: {
    variant: {
      primary: styles.button_primary,

      secondary: styles.button_secondary,

      ghost: styles.button_ghost,
    },

    colorScheme: {
      brand: styles.button_brand,

      gray: styles.button_gray,
    },

    size: {
      small: styles.button_small,

      medium: styles.button_medium,

      large: styles.button_large,
    },
  },

  defaultVariants: {
    variant: "primary",
    colorScheme: "brand",
    size: "medium",
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
  colorScheme,
  size,
  loading,
  ...buttonProps
}: ButtonProps) => {
  return (
    <button className={buttonStyles({ variant, size, colorScheme })} {...buttonProps}>
      {loading && <FiLoader className={styles.spinner} />}

      <span>{children}</span>
    </button>
  );
};
