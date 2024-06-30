import { CiEdit } from "react-icons/ci";
import { useLoaderData, useNavigate } from "@remix-run/react";

import { ROUTE } from "~/utils/enum";

import { loader } from "~/routes/onboarding/route";

import { StepWrapper } from "../../step-wrapper";

import styles from "./resume.module.css";

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

export const Resume = () => {
  const { carwash, profile } = useLoaderData<typeof loader>();

  return (
    <StepWrapper
      title="Resume"
      caption="Check your information and finish your Carwash setup"
      identifier="resume"
    >
      <div className={styles.container}>
        <div className={styles.section_container}>
          <span className={styles.label}>Your First Carwash</span>

          <span className={styles.info_container}>
            <span>{carwash.name}</span>

            <EditButton step={2} />
          </span>
        </div>

        <div className={styles.section_container}>
          <span className={styles.label}>Owner information</span>

          <span className={styles.info_container}>
            <span>
              {profile.first_name} {profile.last_name}
            </span>

            <EditButton step={1} />
          </span>
        </div>
      </div>
    </StepWrapper>
  );
};
