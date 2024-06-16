import { useFetcher, useLoaderData } from "@remix-run/react";

import { TextInput } from "~/components/text-input";

import { loader } from "~/routes/onboarding/route";

import { StepWrapper } from "../../step-wrapper";

import styles from "./carwash-owner-info.module.css";

export const CarwashOwnerInfo = () => {
  const { profile } = useLoaderData<typeof loader>();

  const { data } = useFetcher<{ errors: { [x: string]: string } }>({
    key: "carwash-owner-info",
  });

  const errors = data?.errors;

  return (
    <StepWrapper
      title="Owner Information"
      caption="Complete your information to use it in your Carwash info"
      identifier="carwash-owner-info"
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
