import "reflect-metadata";

import clsx from "clsx";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import type { LinksFunction, LoaderFunction } from "@remix-run/node";

import { Theme } from "./utils/theme/utils";
import { NonThemeFlash } from "./utils/theme/non-theme-flash";
import { ThemeProvider, useTheme } from "./utils/theme/theme-provider";
import { getThemeSession } from "./utils/sessions/theme-session";

import { GlobalLoading } from "./components/global-loading";

import globalStyles from "~/styles/global.css?url";
import lightThemeStyles from "~/styles/light-theme.css?url";
import darkThemeStyles from "~/styles/dark-theme.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStyles },
  {
    rel: "stylesheet",
    href: lightThemeStyles,
  },
  {
    rel: "stylesheet",
    href: darkThemeStyles,
  },
];

export type LoaderData = {
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);

  const data: LoaderData = {
    theme: themeSession.getTheme(),
  };

  return data;
};

const App = () => {
  const { theme } = useTheme();

  const loaderData = useLoaderData<LoaderData>();

  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <NonThemeFlash ssrTheme={Boolean(loaderData.theme)} />
      </head>
      <body>
        <GlobalLoading />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const AppWithProviders = () => {
  const { theme } = useLoaderData<LoaderData>();

  return (
    <ThemeProvider specifiedTheme={theme}>
      <App />
    </ThemeProvider>
  );
};

export default AppWithProviders;
