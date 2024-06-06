import { Link } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";

import styles from "./route.module.css";

export const loader: LoaderFunction = (loaderArgs) => withAuthLoader({ loaderArgs });

export default function HomeRoute() {
  return (
    <div className={styles.container}>
      <h1>Home</h1>

      <div className={styles.links}>
        <Link to={ROUTE.SIGN_IN}>Sign In</Link>
        <Link to={ROUTE.SIGN_UP}>Sign Up</Link>
      </div>
    </div>
  );
}
