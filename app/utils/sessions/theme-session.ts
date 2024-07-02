import { createCookieSessionStorage } from "@remix-run/node";

import { Theme, themes } from "../theme/utils";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) throw new Error("SESSION_SECRET env variable is required");

export const isTheme = (value: unknown): value is Theme => {
  return typeof value === "string" && themes.includes(value as Theme);
};

export const themeSession = createCookieSessionStorage({
  cookie: {
    name: "washyhub/theme",
    secure: true,
    secrets: [SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export const getThemeSession = async (request: Request) => {
  const session = await themeSession.getSession(request.headers.get("Cookie"));

  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : null;
    },

    setTheme: (theme: Theme) => session.set("theme", theme),

    commit: () => themeSession.commitSession(session),
  };
};
