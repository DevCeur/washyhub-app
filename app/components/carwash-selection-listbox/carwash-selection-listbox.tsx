import clsx from "clsx";

import { useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useSubmit } from "@remix-run/react";

import { GoOrganization } from "react-icons/go";
import { HiChevronUpDown } from "react-icons/hi2";
import { FiCheck, FiPlus } from "react-icons/fi";

import type { Carwash } from "@prisma/client";

import { ROUTE } from "~/utils/enum";

import styles from "./carwash-selection-listbox.module.css";

interface CarwashSelectionListbox {
  carwashes: Carwash[];
}

export const CarwashSelectionListbox = ({
  carwashes,
}: CarwashSelectionListbox) => {
  const submit = useSubmit();
  const navigate = useNavigate();

  const [selectedCarwash, setSelectedCarwash] = useState(carwashes[0]);

  const handleCarwashChange = (val: Carwash | "create-carwash") => {
    if (val === "create-carwash") {
      navigate(ROUTE.CARWASHES);

      setSelectedCarwash(selectedCarwash);
    } else {
      submit(
        { current_carwash: val.id },
        {
          method: "post",
          navigate: false,
          action: "/carwashes/set-current-carwash",
        }
      );

      setSelectedCarwash(val);
    }
  };

  return (
    <Listbox value={selectedCarwash} onChange={handleCarwashChange}>
      {({ open }) => (
        <>
          <ListboxButton className={styles.listbox_button_container}>
            <div className={styles.label_container}>
              <GoOrganization className={styles.label_icon} />
              <span className={styles.label}>{selectedCarwash?.name}</span>
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
                <div className={styles.carwash_list}>
                  {carwashes.map((carwash) => (
                    <ListboxOption
                      key={carwash.id}
                      value={carwash}
                      className={styles.option}
                    >
                      <FiCheck className={styles.option_selected_icon} />

                      <span className={styles.option_label}>
                        {carwash.name}
                      </span>
                    </ListboxOption>
                  ))}
                </div>

                <ListboxOption
                  key="create-carwash-option"
                  value="create-carwash"
                  className={clsx(styles.option, styles.option_create_carwash)}
                >
                  <FiPlus />

                  <span className={styles.option_label}>Create Carwash</span>
                </ListboxOption>
              </ListboxOptions>
            )}
          </AnimatePresence>
        </>
      )}
    </Listbox>
  );
};
