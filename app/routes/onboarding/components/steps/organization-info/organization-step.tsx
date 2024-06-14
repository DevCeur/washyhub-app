import { TextInput } from "~/components/text-input";

import { StepWrapper } from "../../step-wrapper";

export const OrganizationStep = () => {
  return (
    <StepWrapper
      title="Your Organization"
      caption="Give it to your organization a name!"
      identifier="organization-info"
    >
      <TextInput
        name="name"
        label="Organization Name"
        hint="You can change this later."
      />
    </StepWrapper>
  );
};
