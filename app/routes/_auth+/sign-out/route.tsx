import { redirect } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";

import { destroySession, getAuthSession } from "~/utils/sessions/auth-session";

export const action: ActionFunction = async ({ request }) => {
  const { authSession } = await getAuthSession({ request });

  authSession.unset("userId");

  return redirect(ROUTE.HOME, {
    headers: { "Set-Cookie": await destroySession(authSession) },
  });
};
