import { json, redirect } from "@remix-run/node";

import type { LoaderFunction } from "@remix-run/node";

import { ROUTE } from "~/utils/enum";
import { withAuthLoader } from "~/utils/with-auth-loader";
import { getUserId } from "~/utils/sessions/auth-session";

import { getUserProfileById } from "~/services/profile";
import { getAllUserOrganizations } from "~/services/organization";

import { Logo } from "~/components/logo";

import { ONBOARDING_STEPS } from "./utils/enum";

import { Wizard } from "./components/wizard";

import styles from "./route.module.css";
import { getUserById } from "~/services/user";

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const url = new URL(request.url);

      const { userId } = await getUserId({ request });

      if (!userId) {
        return redirect(ROUTE.HOME);
      }

      const { user } = await getUserById({ id: userId });

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

      const { profile } = await getUserProfileById({ userId });

      const { organizations } = await getAllUserOrganizations({ userId });

      return json({
        profile,
        organization: organizations[0],
        currentStep: parseInt(currentStep) - 1,
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
