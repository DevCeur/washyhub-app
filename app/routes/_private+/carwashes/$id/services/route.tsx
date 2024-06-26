import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getCarwashById } from "~/services/carwash";

import { CreateServiceModal } from "~/components/modals/create-service-modal";

import styles from "./route.module.css";

interface LoaderData {
  carwash: CarwashWithOwnerServicesAndPackages;
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { id } = params;

      const { carwash } = await getCarwashById({ id: id as string, request });

      return json({ carwash });
    },
  });

export default function CarwashServicesRoute() {
  const { carwash } = useLoaderData<LoaderData>();

  return (
    <div>
      {carwash.services.length === 0 ? (
        <div className={styles.empty_container}>
          <img
            className={styles.empty_icon}
            alt="No Services"
            src="/images/no-services-icon.svg"
          />
          <div className={styles.empty_heading}>
            <h3>No services found</h3>
            <p>Create a new service to get started</p>
          </div>

          <CreateServiceModal variant="primary" />
        </div>
      ) : (
        <div>
          <span></span>
        </div>
      )}
    </div>
  );
}
