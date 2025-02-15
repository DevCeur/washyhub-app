import { useLoaderData } from "@remix-run/react";

import { ONBOARDING_STEPS } from "../../utils/enum";

import { loader } from "../../route";

import { StepsIndicator } from "../steps-indicator";

import styles from "./wizard.module.css";

export const Wizard = () => {
  const { current_step } = useLoaderData<typeof loader>();

  return (
    <div className={styles.container}>
      <StepsIndicator />

      <div>
        {ONBOARDING_STEPS.map(({ identifier, component: Component }, index) => {
          return current_step === index && <Component key={identifier} />;
        })}
      </div>
    </div>
  );
};
