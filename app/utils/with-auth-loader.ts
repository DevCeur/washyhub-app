import { json, redirect } from "@remix-run/node";

import type { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";

import { getUserById } from "~/services/user";

import { ROUTE } from "./enum";

import { getAuthSession, getUserId } from "./auth-session";

const PRIVATE_ROUTES = [ROUTE.DASHBOARD];
const PUBLIC_ROUTES = [
  ROUTE.HOME,
  ROUTE.SIGN_UP,
  ROUTE.SIGN_UP,
  ROUTE.RECOVER_PASSWORD,
  ROUTE.CHANGE_PASSWORD,
];

type WithAuthLoaderOptions = {
  callback?: LoaderFunction;
  loaderArgs: LoaderFunctionArgs;
};

export const withAuthLoader = async ({ callback, loaderArgs }: WithAuthLoaderOptions) => {
  const { request } = loaderArgs;

  const { pathname } = new URL(request.url);

  const { authSession } = await getAuthSession({ request });
  const { userId } = await getUserId({ request });

  const isAuth = authSession.has("userId");

  if (isAuth) {
    const { user, errors } = await getUserById({ id: userId });

    if (errors) {
      return json({ errors });
    }

    if (user?.needs_onboarding && pathname !== ROUTE.ONBOARDING) {
      throw redirect(ROUTE.ONBOARDING);
    }

    if (PUBLIC_ROUTES.includes(pathname)) {
      throw redirect(ROUTE.DASHBOARD);
    }
  }

  if (!isAuth && PRIVATE_ROUTES.includes(pathname)) {
    throw redirect(ROUTE.HOME);
  }

  if (callback) {
    return await callback({ ...loaderArgs });
  }

  return json({ success: true });
};
