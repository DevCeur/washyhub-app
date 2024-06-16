import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";

import { getAuthUser } from "~/services/user";
import { getUserProfile } from "~/services/profile";
import { getAllUserCarwashes } from "~/services/carwash";

import { Logo } from "~/components/logo";

import { ONBOARDING_STEPS } from "./utils/enum";

import { Wizard } from "./components/wizard";

import styles from "./route.module.css";

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const url = new URL(request.url);

      const { user } = await getAuthUser({ request });

      if (!user) {
        return redirect(ROUTE.HOME);
      }

      if (user && !user.needs_onboarding) {
        return redirect(ROUTE.DASHBOARD);
      }

      const currentStep = url.searchParams.get("step");

      if (
        !currentStep ||
        parseInt(currentStep) < 1 ||
        parseInt(currentStep) > ONBOARDING_STEPS.length
      ) {
        return redirect(`${ROUTE.ONBOARDING}?step=1`);
      }

      const { profile } = await getUserProfile({ request });

      const { carwashes } = await getAllUserCarwashes({ request });

      return json({
        profile,
        carwash: carwashes[0],
        current_step: parseInt(currentStep) - 1,
      });
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
