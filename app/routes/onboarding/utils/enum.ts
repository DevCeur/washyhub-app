import { CarwashOwnerInfo } from "../components/steps/carwash-owner-info";
import { CarwashInfo } from "../components/steps/carwash-info";
import { Resume } from "../components/steps/resume";

export const STEP = {
  ORGANIZATION_OWNER: "carwash-owner-info",
  ORGANIZATION: "carwash-info",
  RESUME: "resume",
};

export const ONBOARDING_STEPS = [
  {
    identifier: STEP.ORGANIZATION_OWNER,
    component: CarwashOwnerInfo,
  },
  {
    identifier: STEP.ORGANIZATION,
    component: CarwashInfo,
  },
  {
    identifier: STEP.RESUME,
    component: Resume,
  },
];
