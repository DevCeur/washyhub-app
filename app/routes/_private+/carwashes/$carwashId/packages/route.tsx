import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getCarwashById } from "~/services/carwash";

import { Button } from "~/components/button";
import { CreatePackageModal } from "~/components/modals/create-package-modal";

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

  const needsServices = carwash.packages.length < 2;
  const needsPackages = needsServices && carwash.packages.length === 0;

  return (
    <div>
      {carwash.services.length === 0 ? (
        <div className={styles.empty_container}>
          <img
            className={styles.empty_icon}
            alt="No Services"
            src="/images/no-packages-icon.svg"
          />
          <div className={styles.empty_heading}>
            <h3>No packages found</h3>
            {needsServices ? (
              <p>Create at least 2 services to create a Package</p>
            ) : (
              needsPackages && <p>Create a new Package to get started</p>
            )}
          </div>

          {needsServices ? (
            <Button as="link" href={`${ROUTE.CARWASHES}/${carwash.id}/services`}>
              Create Service
            </Button>
          ) : (
            needsPackages && <CreatePackageModal variant="primary" />
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
