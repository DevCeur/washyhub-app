import { Link } from "@remix-run/react";

import { ROUTE } from "~/utils/enum";

import styles from "./route.module.css";

export default function HomeRoute() {
  return (
    <div className={styles.container}>
      <h1>Home</h1>

      <div className={styles.links}>
        <Link to={ROUTE.SIGN_IN}>Sign In</Link>
        <Link to={ROUTE.SIGN_IN}>Sign Up</Link>
      </div>
    </div>
  );
}
