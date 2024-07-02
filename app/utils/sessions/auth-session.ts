import { createCookieSessionStorage } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) throw new Error("SESSION_SECRET env variable is required");

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "washyhub/auth",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "lax",
      secrets: [SESSION_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });

export const getAuthSession = async ({ request }: { request: Request }) => {
  const header = request.headers.get("Cookie");

  return { authSession: await getSession(header) };
};

export const getUserId = async ({ request }: { request: Request }) => {
  const { authSession } = await getAuthSession({ request });

  const userId = authSession.get("userId");

  return { userId };
};
