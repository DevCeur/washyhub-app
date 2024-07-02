import { prefersDarkTheme } from "./utils";

const clientThemeCode = `
;(() => {
  const theme = window.matchMedia(${JSON.stringify(prefersDarkTheme)}).matches
    ? 'dark'
    : 'light';
  const cl = document.documentElement.classList;
  const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
  if (themeAlreadyApplied) {
    // this script shouldn't exist if the theme is already applied!
    return "hello world"
  } else {
    cl.add(theme);
  }
})();
`;

interface NonThemeFlashProps {
  ssrTheme: boolean;
}

export const NonThemeFlash = ({ ssrTheme }: NonThemeFlashProps) => {
  return ssrTheme ? (
    <></>
  ) : (
    <script dangerouslySetInnerHTML={{ __html: clientThemeCode }} />
  );
};
