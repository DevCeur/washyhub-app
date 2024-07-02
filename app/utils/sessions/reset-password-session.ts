import { createCookieSessionStorage } from "@remix-run/node";

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) throw new Error("SESSION_SECRET env variable is required");

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: "washyhub/rpt",
      httpOnly: true,
      maxAge: 60,
      sameSite: "lax",
      secrets: [SESSION_SECRET],
      secure: process.env.NODE_ENV === "production",
    },
  });

export const getResetPasswordSession = async ({
  request,
}: {
  request: Request;
}) => {
  const header = request.headers.get("Cookie");

  return { resetPasswordSession: await getSession(header) };
};

export const getUserId = async ({ request }: { request: Request }) => {
  const { resetPasswordSession } = await getResetPasswordSession({ request });

  const userId = resetPasswordSession.get("userId");

  return { userId };
};
