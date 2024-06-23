import clsx from "clsx";

import { Form, Link } from "@remix-run/react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

import { MdOutlineManageAccounts } from "react-icons/md";
import { HiChevronUpDown, HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";

import type { Profile, User } from "@prisma/client";

import { ROUTE } from "~/utils/enum";

import styles from "./account-settings-listbox.module.css";

interface AccountSettingsListboxProps {
  user: User;
  profile: Profile;
}

export const AccountSettingsListbox = ({
  user,
  profile,
}: AccountSettingsListboxProps) => {
  return (
    <Listbox>
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
                <ListboxOption key="account-link" value="account-link">
                  <Link to={ROUTE.ACCOUNT} className={styles.option}>
                    <MdOutlineManageAccounts className={styles.option_icon} />

                    <span className={styles.option_label}>My Account</span>
                  </Link>
                </ListboxOption>

                <ListboxOption key="sign-out" value="sign-out">
                  <Form action="/sign-out" method="post">
                    <button
                      type="submit"
                      className={clsx(styles.option, styles.option_danger)}
                    >
                      <HiOutlineArrowRightStartOnRectangle
                        className={styles.option_icon}
                      />

                      <span>Sign Out</span>
                    </button>
                  </Form>
                </ListboxOption>
              </ListboxOptions>
            )}
          </AnimatePresence>
        </>
      )}
    </Listbox>
  );
};
