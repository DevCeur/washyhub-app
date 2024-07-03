import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";

import { Theme } from "~/utils/theme/utils";
import { useTheme } from "~/utils/theme/theme-provider";

import styles from "./theme-switch.module.css";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <button
      data-isOn={theme === Theme.LIGHT}
      className={styles.switch}
      onClick={handleToggleTheme}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 650, damping: 30 }}
        className={styles.handler}
      >
        {theme === Theme.LIGHT ? <FiSun /> : <FiMoon />}
      </motion.span>
    </button>
  );
};
