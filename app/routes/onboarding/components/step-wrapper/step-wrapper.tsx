import { useFetcher, useLoaderData, useNavigate } from "@remix-run/react";

import type { MouseEvent } from "react";

import { loader } from "../../route";

import { ROUTE } from "~/utils/enum";

import { Button } from "~/components/button";

import { ONBOARDING_STEPS } from "../../utils/enum";

import styles from "./step-wrapper.module.css";

type StepIdentifier = "organization-owner-info" | "organization-info" | "resume";

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

  const { currentStep, profile, organization } = useLoaderData<typeof loader>();

  const isFirstStep = currentStep == 0;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleGoBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    navigate(`${ROUTE.ONBOARDING}?step=${currentStep}`);
  };

  const isLoading = fetcher.state === "submitting";

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h2>
          {currentStep + 1}. {title}
        </h2>
        <p>{caption}</p>
      </div>

      <fetcher.Form
        action={`${ROUTE.ONBOARDING}/api/${identifier}`}
        method="post"
        className={styles.form}
      >
        <div className={styles.fields_container}>{children}</div>

        <input type="hidden" name="currentStep" value={currentStep + 1} />
        <input type="hidden" name="organizationId" value={organization?.id || ""} />

        <div className={styles.buttons_container}>
          <Button
            type="submit"
            data-fullwidth={isFirstStep || isLastStep}
            variant={isLastStep ? "brand" : "default"}
            loading={isLoading}
          >
            {isLastStep ? "Finish" : profile || organization ? "Save" : "Continue"}
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
