import clsx from "clsx";

import { useLoaderData } from "@remix-run/react";
import { IoIosCheckmark } from "react-icons/io";

import { loader } from "../../route";

import { ONBOARDING_STEPS } from "../../utils/enum";

import styles from "./step-indicator.module.css";

export const StepsIndicator = () => {
  const { currentStep } = useLoaderData<typeof loader>();

  return (
    <div className={styles.container}>
      {ONBOARDING_STEPS.map(({ identifier }, index) => {
        const isActiveStep = currentStep === index;
        const isCompleted = index < currentStep;

        return (
          <div key={identifier} className={styles.indicator_container}>
            <span
              className={clsx(
                styles.indicator,
                isCompleted && styles.indicator_completed,
                (isActiveStep || isCompleted) && styles.indicator_active
              )}
            >
              {isCompleted ? (
                <IoIosCheckmark className={styles.completed_icon} />
              ) : (
                index + 1
              )}
            </span>

            {index !== ONBOARDING_STEPS.length - 1 && (
              <hr
                className={clsx(
                  styles.separator,
                  isCompleted && styles.separator_completed
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
