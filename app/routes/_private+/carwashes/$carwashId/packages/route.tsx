import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getCarwashById } from "~/services/carwash";

import { CreatePackageModal } from "~/components/modals/create-package-modal";

import { Button } from "~/components/button";

import styles from "./route.module.css";

interface LoaderData {
  carwash: CarwashWithOwnerServicesAndPackages;
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { carwashId } = params;

      const { carwash } = await getCarwashById({ id: carwashId as string, request });

      return json({ carwash });
    },
  });

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.carwash?.name} - Packages` }];
};

export default function CarwashPackagesRoute() {
  const { carwash } = useLoaderData<LoaderData>();

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
            <Button as="link" href={`${ROUTE.CARWASHES}/${carwash.id}/services`}>
              Create Service
            </Button>
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
