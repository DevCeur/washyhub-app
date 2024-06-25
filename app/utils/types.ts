import type {
  Carwash,
  CarwashPackage,
  CarwashService,
  Profile,
  User,
} from "@prisma/client";

export interface UserWithProfile extends User {
  profile: Profile;
}

export interface CarwashWithOwner extends Carwash {
  owner: UserWithProfile;
}

export interface CarwashWithOwnerServicesAndPackages extends CarwashWithOwner {
  services: CarwashService[];
  packages: CarwashPackage[];
}
