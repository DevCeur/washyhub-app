export enum Theme {
  DARK = "dark",
  LIGHT = "light",
}

export const themes: Array<Theme> = Object.values(Theme);

export const prefersDarkTheme = "(prefers-color-scheme: dark)";

export const getPreferredTheme = () =>
  window.matchMedia(prefersDarkTheme).matches ? Theme.DARK : Theme.LIGHT;
