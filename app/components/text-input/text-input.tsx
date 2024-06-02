import type { InputHTMLAttributes } from "react";

import styles from "./text-input.module.css";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const TextInput = ({ label, error, ...inputProps }: TextInputProps) => {
  return (
    <label className={styles.container}>
      <span className={styles.label}>{label}</span>

      <input className={styles.input} {...inputProps} />

      {error && <span className={styles.error}>{error}</span>}
    </label>
  );
};
