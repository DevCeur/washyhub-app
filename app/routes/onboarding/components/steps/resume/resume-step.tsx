import { useLoaderData, useNavigate } from "@remix-run/react";
import { CiEdit } from "react-icons/ci";

import { loader } from "~/routes/onboarding/route";

import { StepWrapper } from "../../step-wrapper";

import styles from "./resume-step.module.css";
import { ROUTE } from "~/utils/enum";

const EditButton = ({ step }: { step: 1 | 2 }) => {
  const navigate = useNavigate();

  return (
    <button
      className={styles.edit_button}
      onClick={(e) => {
        e.preventDefault();

        navigate(`${ROUTE.ONBOARDING}?step=${step}`);
      }}
    >
      Edit
      <CiEdit />
    </button>
  );
};

export const ResumeStep = () => {
  const { organization, profile } = useLoaderData<typeof loader>();

  return (
    <StepWrapper
      title="Resume"
      caption="Check your information and finish your organization setup"
      identifier="resume"
    >
      <div className={styles.container}>
        <div className={styles.section_container}>
          <span className={styles.label}>Your organization</span>

          <span className={styles.info_container}>
            <span>{organization.name}</span>

            <EditButton step={1} />
          </span>
        </div>

        <div className={styles.section_container}>
          <span className={styles.label}>Owner information</span>

          <span className={styles.info_container}>
            <span>
              {profile.first_name} {profile.last_name}
            </span>

            <EditButton step={2} />
          </span>
        </div>
      </div>
    </StepWrapper>
  );
};
