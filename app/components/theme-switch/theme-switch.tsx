import { Theme } from "~/utils/theme/utils";
import { useTheme } from "~/utils/theme/theme-provider";

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  };

  return (
    <button onClick={handleToggleTheme}>
      <span>{theme}</span>
    </button>
  );
};
