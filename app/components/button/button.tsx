import clsx from "clsx";

import { cva } from "class-variance-authority";
import { FiLoader } from "react-icons/fi";
import { Link } from "@remix-run/react";
import { ListboxButton } from "@headlessui/react";

import type { IconType } from "react-icons";
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

      danger: styles.button_danger,
    },

    size: {
      small: styles.button_small,

      medium: styles.button_medium,

      large: styles.button_large,
    },
  },

  defaultVariants: {
    hierarchy: "primary",
    variant: "default",
    size: "small",
  },
});

type PolymorphicProps<E extends React.ElementType> = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<E> & {
    as?: E | "listboxButton";
  }
>;

type ButtonProps<T extends React.ElementType> = PolymorphicProps<T> &
  VariantProps<typeof buttonStyles> & {
    icon?: IconType;
    children?: React.ReactNode;
    loading?: boolean;
    overlay?: boolean;
  };

export const Button = <T extends React.ElementType = "button">({
  as,
  href,
  hierarchy,
  children,
  loading,
  size,
  variant,
  overlay,
  icon: Icon,
  className,
  ...elementProps
}: ButtonProps<T>) => {
  const Component =
    as === "link" ? Link : as === "listboxButton" ? ListboxButton : "button";

  return (
    <>
      <Component
        to={href}
        className={clsx(
          buttonStyles({ variant, size, hierarchy }),
          Icon && !children && styles.icon_button,
          Icon && children && styles.with_icon,
          overlay && styles.overlay,
          loading && styles.loading,
          className
        )}
        {...elementProps}
      >
        {Icon && <Icon />}

        {children}

        {loading && <FiLoader className={styles.spinner} />}
      </Component>
    </>
  );
};
