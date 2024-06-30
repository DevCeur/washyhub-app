import { TextareaHTMLAttributes, forwardRef } from "react";

import styles from "./textarea-input.module.css";

interface TextareaInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const TextareaInput = forwardRef<HTMLTextAreaElement, TextareaInputProps>(
  ({ label, hint, error, ...textareaProps }, ref) => {
    return (
      <label className={styles.container}>
        {label && <span className={styles.label}>{label}</span>}

        <textarea ref={ref} className={styles.input} {...textareaProps} />

        {hint && !error && <span className={styles.hint}>{hint}</span>}

        {error && <span className={styles.error}>{error}</span>}
      </label>
    );
  }
);

TextareaInput.displayName = "TextareaInput";
