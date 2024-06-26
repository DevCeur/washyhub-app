import MaskedInput, { MaskedInputProps } from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

import { LegacyRef, forwardRef } from "react";

import styles from "./currency-input.module.css";

const defaultMaskOptions = {
  prefix: "$",
  suffix: "",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ".",
  allowDecimal: true,
  decimalSymbol: ",",
  decimalLimit: 2,
  integerLimit: 7,
  allowNegative: false,
  allowLeadingZeroes: false,
};

interface CurrencyInputProps extends Partial<MaskedInputProps> {
  label?: string;
  hint?: string;
  error?: string;
}

export const CurrencyInput = forwardRef<unknown, CurrencyInputProps>(
  ({ hint, error, label, ...maskedInputProps }, ref) => {
    const currencyMask = createNumberMask(defaultMaskOptions);

    return (
      <label className={styles.container}>
        {label && <span className={styles.label}>{label}</span>}

        <MaskedInput
          {...maskedInputProps}
          mask={currencyMask}
          ref={ref as LegacyRef<MaskedInput> | undefined}
          className={styles.input}
          data-error={!!error}
        />

        {hint && !error && <span className={styles.hint}>{hint}</span>}

        {error && <span className={styles.error}>{error}</span>}
      </label>
    );
  }
);

CurrencyInput.displayName = "CurrencyInput";
