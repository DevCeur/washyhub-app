import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

import { FiCheck } from "react-icons/fi";
import { HiChevronUpDown } from "react-icons/hi2";

import type { ListboxProps } from "@headlessui/react";

import styles from "./select.module.css";

interface Option {
  id: string;
  label: string;
}

interface SelectProps extends ListboxProps {
  label?: string;
  hint?: string;
  error?: string;
  selectedOption: Option;
  options: Option[];
}

export const Select = ({
  label,
  hint,
  error,
  options,
  selectedOption,
  onChange: handleChange,
}: SelectProps) => {
  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}

      <Listbox
        value={selectedOption}
        onChange={handleChange as unknown as (val: Option) => void}
      >
        {({ open }) => (
          <>
            <ListboxButton className={styles.listbox_button_container}>
              <div className={styles.label_container}>
                <span className={styles.button_label}>{selectedOption?.label}</span>
              </div>

              <div className={styles.up_down_icon_container}>
                <HiChevronUpDown />
              </div>
            </ListboxButton>

            <AnimatePresence mode="wait">
              {open && (
                <ListboxOptions
                  static
                  as={motion.div}
                  anchor="bottom"
                  initial={{ opacity: 0, translateY: 16 }}
                  animate={{ opacity: 1, translateY: 24 }}
                  exit={{ opacity: 0, translateY: 16 }}
                  transition={{ duration: 0.15 }}
                  className={styles.listbox_options_container}
                >
                  <div className={styles.options_list}>
                    {options.map((option) => (
                      <ListboxOption
                        key={option.id}
                        value={option}
                        className={styles.option}
                      >
                        <FiCheck className={styles.option_selected_icon} />

                        <span className={styles.option_label}>{option.label}</span>
                      </ListboxOption>
                    ))}
                  </div>
                </ListboxOptions>
              )}
            </AnimatePresence>
          </>
        )}
      </Listbox>

      {hint && !error && <span className={styles.hint}>{hint}</span>}

      {error && <span>{error}</span>}
    </div>
  );
};
