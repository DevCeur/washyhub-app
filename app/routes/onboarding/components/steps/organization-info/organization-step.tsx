import { useFetcher, useLoaderData } from "@remix-run/react";

import { loader } from "~/routes/onboarding/route";

import { TextInput } from "~/components/text-input";

import { StepWrapper } from "../../step-wrapper";

export const OrganizationStep = () => {
  const { organization } = useLoaderData<typeof loader>();

  const { data } = useFetcher<{ errors: { [x: string]: string } }>({
    key: "organization-info",
  });

  const errors = data?.errors;

  return (
    <StepWrapper
      title="Your Organization"
      caption="Give it to your organization a name!"
      identifier="organization-info"
    >
      <TextInput
        name="organization_name"
        label="Organization Name"
        hint="You can change this later."
        defaultValue={organization?.name || ""}
        error={errors?.organization_name}
      />
    </StepWrapper>
  );
};
