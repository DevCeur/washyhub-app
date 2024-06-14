import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";
import { getUserId } from "~/utils/sessions/auth-session";

import { getUserProfileById } from "~/services/profile";

import { Logo } from "~/components/logo";

import { ONBOARDING_STEPS } from "./utils/enum";

import { Wizard } from "./components/wizard";

import styles from "./route.module.css";

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const url = new URL(request.url);

      const { userId } = await getUserId({ request });

      const currentStep = url.searchParams.get("step");

      if (
        !currentStep ||
        parseInt(currentStep) < 1 ||
        parseInt(currentStep) > ONBOARDING_STEPS.length
      ) {
        return redirect(`${ROUTE.ONBOARDING}?step=1`);
      }

      const { profile } = await getUserProfileById({ userId });

      return json({ profile, currentStep: parseInt(currentStep) - 1 });
    },
  });

export default function OnboardingRoute() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.logo}>
          <Logo />
        </span>
      </header>

      <div className={styles.content}>
        <Wizard />
      </div>
    </div>
  );
}
