import { createCookieSessionStorage } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) throw new Error("SESSION_SECRET env variable is required");

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "washyhub/current-carwash",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secrets: [SESSION_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });

export const getCurrentCarwashSession = async ({
  request,
}: {
  request: Request;
}) => {
  const header = request.headers.get("Cookie");

  return { currentCarwashSession: await getSession(header) };
};

export const getCurrentCarwashId = async ({
  request,
}: {
  request: Request;
}) => {
  const { currentCarwashSession } = await getCurrentCarwashSession({ request });

  const carwashId = currentCarwashSession.get("carwashId");

  return { carwashId };
};
