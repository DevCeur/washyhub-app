import { OrganizationOwnerStep } from "../components/steps/organization-owner-info";
import { OrganizationStep } from "../components/steps/organization-info";
import { ResumeStep } from "../components/steps/resume";

export const STEP = {
  ORGANIZATION_OWNER: "organization-owner",
  ORGANIZATION: "organization",
  RESUME: "resume",
};

export const ONBOARDING_STEPS = [
  {
    identifier: STEP.ORGANIZATION_OWNER,
    component: OrganizationOwnerStep,
  },
  {
    identifier: STEP.ORGANIZATION,
    component: OrganizationStep,
  },
  {
    identifier: STEP.RESUME,
    component: ResumeStep,
  },
];
