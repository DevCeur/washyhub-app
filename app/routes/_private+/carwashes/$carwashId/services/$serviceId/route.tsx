import { useLoaderData, useNavigate } from "@remix-run/react";

import { FaChevronLeft } from "react-icons/fa";
import { MdLocalCarWash } from "react-icons/md";

import type { LoaderFunction } from "@remix-run/node";
import type {
  CarwashServiceWithCarwash,
  CarwashWithOwnerServicesAndPackages,
} from "~/utils/types";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { getAllUserCarwashes } from "~/services/carwash";
import { getServiceById } from "~/services/carwash-services";

import { Button } from "~/components/button";

import { DeleteServiceModal } from "~/components/modals/delete-service-modal";
import { UpdateServiceModal } from "~/components/modals/update-service-modal";

import styles from "./route.module.css";

interface LoaderData {
  service: CarwashServiceWithCarwash;
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { serviceId } = params;

      const { service } = await getServiceById({ id: serviceId as string });
      const { carwashes } = await getAllUserCarwashes({ request });

      return { service: service, carwashes };
    },
  });

export default function ServiceRoute() {
  const navigate = useNavigate();

  const { service, carwashes } = useLoaderData<LoaderData>();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header_content}>
          <Button
            size="small"
            hierarchy="tertiary"
            onClick={() => navigate(-1)}
            icon={FaChevronLeft}
            className={styles.go_back_button}
          >
            Go Back
          </Button>

          <div className={styles.service_info_container}>
            <div className={styles.service_icon}>
              <MdLocalCarWash />
            </div>

            <div className={styles.service_info}>
              <h1 className={styles.name}>{service.name}</h1>

              {service.description && (
                <p className={styles.description}>{service.description}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <DeleteServiceModal
            from="page"
            variant="page"
            service={service as unknown as CarwashServiceWithCarwash}
          />

          <UpdateServiceModal
            variant="page"
            service={service as unknown as CarwashServiceWithCarwash}
            carwashes={
              carwashes as unknown as CarwashWithOwnerServicesAndPackages[]
            }
          />
        </div>
      </div>
    </div>
  );
}
