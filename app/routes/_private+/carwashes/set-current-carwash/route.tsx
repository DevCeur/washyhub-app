import { json } from "@remix-run/node";

import type { ActionFunction } from "@remix-run/node";

import {
  commitSession,
  getCurrentCarwashSession,
} from "~/utils/sessions/current-carwash-session";

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());

  const { currentCarwashSession } = await getCurrentCarwashSession({ request });

  currentCarwashSession.set("carwashId", formData.current_carwash);

  return json(
    { formData },
    { headers: { "Set-Cookie": await commitSession(currentCarwashSession) } }
  );
};
