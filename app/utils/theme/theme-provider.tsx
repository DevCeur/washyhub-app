import { createContext, useContext, useEffect, useRef, useState } from "react";

import type { Dispatch, SetStateAction } from "react";

import { Theme, getPreferredTheme, themes } from "./utils";
import { useFetcher } from "@remix-run/react";

type ThemeContextType = {
  theme: Theme | null;
  setTheme: Dispatch<SetStateAction<Theme | null>>;
};

const themeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  specifiedTheme: Theme | null;
}

export const ThemeProvider = ({
  children,
  specifiedTheme,
}: ThemeProviderProps) => {
  const persistTheme = useFetcher();

  const [theme, setTheme] = useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      }
    }

    if (typeof window !== "object") return null;

    return getPreferredTheme();
  });

  const persistThemeRef = useRef(persistTheme);

  useEffect(() => {
    persistThemeRef.current = persistTheme;
  }, [persistTheme]);

  const mountRun = useRef(false);

  useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) {
      return;
    }

    persistThemeRef.current.submit(
      { theme },
      { action: "/theme", method: "post" }
    );
  }, [theme]);

  return (
    <>
      <themeContext.Provider value={{ theme, setTheme }}>
        {children}
      </themeContext.Provider>
    </>
  );
};

export const useTheme = () => {
  const context = useContext(themeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
