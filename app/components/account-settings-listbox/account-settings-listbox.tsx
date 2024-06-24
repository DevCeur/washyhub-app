import clsx from "clsx";

import { useState } from "react";
import { useNavigate, useSubmit } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";

import { MdOutlineManageAccounts } from "react-icons/md";
import { HiChevronUpDown, HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";

import type { Profile, User } from "@prisma/client";

import { ROUTE } from "~/utils/enum";

import styles from "./account-settings-listbox.module.css";

interface AccountSettingsListboxProps {
  user: User;
  profile: Profile;
}

type Action = null | "sign-out" | "go-to-account";

export const AccountSettingsListbox = ({
  user,
  profile,
}: AccountSettingsListboxProps) => {
  const submit = useSubmit();
  const navigate = useNavigate();

  const [action, setAction] = useState<Action>();

  const handleChange = (val: Action) => {
    setAction(val);

    switch (val) {
      case "sign-out":
        submit(
          { success: true },
          { action: "/sign-out", method: "post", navigate: false }
        );
        break;

      case "go-to-account":
        navigate(ROUTE.ACCOUNT);
    }
  };

  return (
    <Listbox value={action} onChange={handleChange}>
      {({ open }) => (
        <>
          <ListboxButton className={styles.listbox_button_container}>
            <div className={styles.user_info_container}>
              <div className={styles.user_initial}>{profile.first_name.charAt(0)}</div>

              <div className={styles.user_info}>
                <span className={styles.user_first_name}>{profile.first_name}</span>
                <span className={styles.user_email}>{user.email}</span>
              </div>
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
                initial={{ opacity: 0, translateY: -11 }}
                animate={{ opacity: 1, translateY: -16 }}
                exit={{ opacity: 0, translateY: -11 }}
                transition={{ duration: 0.15 }}
                className={styles.listbox_options_container}
              >
                <ListboxOption
                  key="account-link"
                  value="go-to-account"
                  className={styles.option}
                >
                  <MdOutlineManageAccounts className={styles.option_icon} />

                  <span className={styles.option_label}>My Account</span>
                </ListboxOption>

                <ListboxOption
                  key="sign-out"
                  value="sign-out"
                  className={clsx(styles.option, styles.option_danger)}
                >
                  <HiOutlineArrowRightStartOnRectangle className={styles.option_icon} />

                  <span>Sign Out</span>
                </ListboxOption>
              </ListboxOptions>
            )}
          </AnimatePresence>
        </>
      )}
    </Listbox>
  );
};
