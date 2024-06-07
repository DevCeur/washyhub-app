import { Link, Outlet, useLocation } from "@remix-run/react";

import { ROUTE } from "~/utils/enum";

import styles from "./layout.module.css";

const COPIES_BY_LOCATION = {
  [ROUTE.SIGN_IN]: {
    redirectionShortLink: {
      text: "Create Account",
      url: ROUTE.SIGN_UP,
    },

    heading: "Sign in",
  },

  [ROUTE.SIGN_UP]: {
    redirectionShortLink: {
      text: "Sign In",
      url: ROUTE.SIGN_IN,
    },

    heading: "Create a WashyHub Account",
  },

  [ROUTE.RECOVER_PASSWORD]: {
    redirectionShortLink: {
      text: "Sign In",
      url: ROUTE.SIGN_IN,
    },

    heading: "Recover your Password",
  },

  [ROUTE.CHANGE_PASSWORD]: {
    redirectionShortLink: {
      text: "Sign In",
      url: ROUTE.SIGN_IN,
    },

    heading: "Change Password",
  },
};

export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to={ROUTE.HOME}>Home</Link>

        <Link to={COPIES_BY_LOCATION[location.pathname].redirectionShortLink.url}>
          {COPIES_BY_LOCATION[location.pathname].redirectionShortLink.text}
        </Link>
      </header>

      <div className={styles.content_container}>
        <Link to={ROUTE.HOME} className={styles.logo}>
          WashyHub
        </Link>

        <div className={styles.heading}>
          <h1>{COPIES_BY_LOCATION[location.pathname].heading}</h1>

          {location.pathname === ROUTE.SIGN_IN && (
            <span>
              Don&apos;t have an account? <Link to={ROUTE.SIGN_UP}>Sign Up</Link>
            </span>
          )}

          {location.pathname === ROUTE.SIGN_UP && (
            <span>
              Already have an account? <Link to={ROUTE.SIGN_IN}>Sign In</Link>
            </span>
          )}

          {location.pathname === ROUTE.RECOVER_PASSWORD && (
            <span>
              Include the email address associated with your account and we&apos;ll send
              you an email with instructions to reset your password.
            </span>
          )}
        </div>

        <main className={styles.content}>
          <Outlet />

          {(location.pathname === ROUTE.SIGN_IN ||
            location.pathname === ROUTE.SIGN_UP) && (
            <span className={styles.account_agreement}>
              By proceeding, you agree to WashyHub{" "}
              <Link to={ROUTE.HOME}>Terms of Service</Link> and{" "}
              <Link to={ROUTE.HOME}>Privacy Policy.</Link>
            </span>
          )}
        </main>
      </div>
    </div>
  );
}
