import { useFetcher, useLoaderData } from "@remix-run/react";

import { TextInput } from "~/components/text-input";

import { loader } from "~/routes/onboarding/route";

import { StepWrapper } from "../../step-wrapper";

import styles from "./organization-owner-step.module.css";

export const OrganizationOwnerStep = () => {
  const { profile } = useLoaderData<typeof loader>();

  const { data } = useFetcher<{ errors: { [x: string]: string } }>({
    key: "organization-owner-info",
  });

  const errors = data?.errors;

  return (
    <StepWrapper
      title="Owner Information"
      caption="complete your information to use it for your owner role"
      identifier="organization-owner-info"
    >
      <div className={styles.names_container}>
        <TextInput
          label="First Name"
          name="first_name"
          error={errors?.first_name}
          defaultValue={profile?.first_name}
        />

        <TextInput
          label="Last Name"
          name="last_name"
          error={errors?.last_name}
          defaultValue={profile?.last_name}
        />
      </div>
    </StepWrapper>
  );
};
