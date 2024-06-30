import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

import type { MouseEvent } from "react";

import { loader } from "../../route";

import { ROUTE } from "~/utils/enum";

import { Button } from "~/components/button";

import { ONBOARDING_STEPS } from "../../utils/enum";

import styles from "./step-wrapper.module.css";

type StepIdentifier = "carwash-owner-info" | "carwash-info" | "resume";

interface StepWrapperProps {
  title?: string;
  caption?: string;
  identifier: StepIdentifier;
  children: React.ReactNode;
}

export const StepWrapper = ({
  title,
  caption,
  identifier,
  children,
}: StepWrapperProps) => {
  const navigate = useNavigate();
  const fetcher = useFetcher({ key: identifier });

  const { current_step, carwash } = useLoaderData<typeof loader>();

  const isFirstStep = current_step == 0;
  const isLastStep = current_step === ONBOARDING_STEPS.length - 1;

  const formAction = `${ROUTE.ONBOARDING}/api/${identifier}`;

  const handleGoBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigate(`${ROUTE.ONBOARDING}?step=${current_step}`);
  };

  const isLoading =
    (fetcher.state === "submitting" || fetcher.state === "loading") &&
    fetcher.formAction === formAction;

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>
          {current_step + 1}. {title}
        </h2>
        <p>{caption}</p>
      </div>

      <fetcher.Form method="post" action={formAction} className={styles.form}>
        <div className={styles.fields_container}>{children}</div>

        <input type="hidden" name="current_step" value={current_step + 1} />
        <input type="hidden" name="carwash_id" value={carwash?.id || ""} />

        <div className={styles.buttons_container}>
          <Button
            size="medium"
            type="submit"
            data-fullwidth={isFirstStep || isLastStep}
            variant={isLastStep ? "brand" : "default"}
            loading={isLoading}
          >
            {isLastStep ? "Finish" : "Continue"}
          </Button>

          {!isFirstStep && (
            <Button hierarchy="tertiary" onClick={handleGoBack}>
              Go Back
            </Button>
          )}
        </div>
      </fetcher.Form>
    </div>
  );
};
