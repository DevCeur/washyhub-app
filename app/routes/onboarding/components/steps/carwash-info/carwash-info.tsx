import { useFetcher, useLoaderData } from "@remix-run/react";

import { loader } from "~/routes/onboarding/route";

import { TextInput } from "~/components/text-input";

import { StepWrapper } from "../../step-wrapper";

export const CarwashInfo = () => {
  const { carwash } = useLoaderData<typeof loader>();

  const { data } = useFetcher<{ errors: { [x: string]: string } }>({
    key: "carwash-info",
  });

  const errors = data?.errors;

  return (
    <StepWrapper
      title="Your Organization"
      caption="Give it a name to your new Carwash!"
      identifier="carwash-info"
    >
      <TextInput
        name="carwash_name"
        label="Organization Name"
        hint="You can change this later."
        defaultValue={carwash?.name || ""}
        error={errors?.carwash_name}
      />
    </StepWrapper>
  );
};
