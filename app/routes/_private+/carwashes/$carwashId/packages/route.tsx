import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { withAuthLoader } from "~/utils/with-auth-loader";

import {
  getAllUserCarwashes,
  getCarwashById,
  getCurrentCarwash,
} from "~/services/carwash";

import { CreatePackageModal } from "~/components/modals/create-package-modal";
import { CreateServiceModal } from "~/components/modals/create-service-modal";

import styles from "./route.module.css";

interface LoaderData {
  carwash: CarwashWithOwnerServicesAndPackages;
  currentCarwash: CarwashWithOwnerServicesAndPackages;
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { carwashId } = params;

      const { carwash } = await getCarwashById({ id: carwashId as string, request });
      const { carwash: currentCarwash } = await getCurrentCarwash({ request });
      const { carwashes } = await getAllUserCarwashes({ request });

      return json({ carwash, currentCarwash, carwashes });
    },
  });

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.carwash?.name} - Packages` }];
};

export default function CarwashPackagesRoute() {
  const { carwash, carwashes, currentCarwash } = useLoaderData<LoaderData>();

  const emptyServices = carwash.services.length === 0;
  const emptyPackages = carwash.packages.length === 0;

  const servicesRequired = 2 - carwash.services.length;

  return (
    <div>
      {emptyServices || emptyPackages ? (
        <div className={styles.empty_container}>
          <img
            className={styles.empty_icon}
            alt="No Services"
            src="/images/no-packages-icon.svg"
          />

          <div className={styles.empty_heading}>
            <h3>No packages found</h3>
            {servicesRequired > 0 ? (
              <p>
                Create {servicesRequired} more service{servicesRequired > 1 ? "s" : ""} to
                create a Package
              </p>
            ) : (
              emptyPackages && <p>Create a new package to get started</p>
            )}
          </div>

          {emptyServices || servicesRequired > 0 ? (
            <CreateServiceModal
              variant="primary"
              currentCarwash={
                currentCarwash as unknown as CarwashWithOwnerServicesAndPackages
              }
              carwash={carwash as unknown as CarwashWithOwnerServicesAndPackages}
              carwashes={carwashes as unknown as CarwashWithOwnerServicesAndPackages[]}
            />
          ) : (
            emptyPackages && <CreatePackageModal variant="primary" />
          )}
        </div>
      ) : (
        <div>
          <span></span>
        </div>
      )}
    </div>
  );
}
