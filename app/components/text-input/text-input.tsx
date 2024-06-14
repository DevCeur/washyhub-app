import { useState } from "react";
import { Link } from "@remix-run/react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";

import type { MouseEvent, InputHTMLAttributes } from "react";

import { ROUTE } from "~/utils/enum";

import styles from "./text-input.module.css";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  showForgotPassword?: boolean;
}

export const TextInput = ({
  type,
  error,
  label,
  hint,
  showForgotPassword,
  ...inputProps
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(type === "password");

  const handleShowPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setShowPassword((prev) => !prev);
  };

  return (
    <label className={styles.container}>
      <div className={styles.labels_container}>
        {label && <span className={styles.label}>{label}</span>}

        {showForgotPassword && (
          <Link to={ROUTE.RECOVER_PASSWORD} className={styles.recover_password_link}>
            Forgot your password?
          </Link>
        )}
      </div>

      <div className={styles.input_container} data-error={!!error}>
        <input
          type={type === "password" && showPassword ? "password" : "text" || type}
          autoComplete="off"
          className={styles.input}
          {...inputProps}
        />

        {type === "password" && (
          <button className={styles.show_password_button} onClick={handleShowPassword}>
            {showPassword ? <HiOutlineEye /> : <HiOutlineEyeOff />}
          </button>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}

      {!error && hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
};
