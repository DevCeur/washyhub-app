import { createCookieSessionStorage } from "@remix-run/node";

const AUTH_SESSION_SECRET = process.env.AUTH_SESSION_SECRET;

if (!AUTH_SESSION_SECRET) throw new Error("AUTH_SESSION_SECRET env variable is required");

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "current-carwash/washyhub",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secrets: [AUTH_SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export const getCurrentCarwashSession = async ({ request }: { request: Request }) => {
  const header = request.headers.get("Cookie");

  return { currentCarwashSession: await getSession(header) };
};

export const getCurrentCarwashId = async ({ request }: { request: Request }) => {
  const { currentCarwashSession } = await getCurrentCarwashSession({ request });

  const carwashId = currentCarwashSession.get("carwashId");

  return { carwashId };
};
