import dayjs from "dayjs";

import { z } from "zod";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import type {
  CarwashServiceWithCarwash,
  CarwashWithOwnerServicesAndPackages,
} from "~/utils/types";

import { ERROR_MESSAGE } from "~/utils/enum";

import { convertCurrencyToNumber } from "~/utils/currency";
import { withAuthLoader } from "~/utils/with-auth-loader";

import { createCarwashService, deleteCarwashService } from "~/services/carwash-services";
import { getAllUserCarwashes, getCarwashById } from "~/services/carwash";

import { CarwashServicesTable } from "~/components/carwash-services-table";

import { CreateServiceModal } from "~/components/modals/create-service-modal";

import styles from "./route.module.css";

interface LoaderData {
  carwash: CarwashWithOwnerServicesAndPackages;
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ params, request }) => {
      const { carwashId } = params;

      const { carwash } = await getCarwashById({
        id: carwashId as string,
        request,
      });
      const { carwashes } = await getAllUserCarwashes({ request });

      return json({ carwash, carwashes });
    },
  });

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [{ title: `${data?.carwash?.name} - Services` }];
};

export const action: ActionFunction = async ({ request }) => {
  switch (request.method) {
    case "POST": {
      const formData = Object.fromEntries(await request.formData());

      const formSchema = z.object({
        service_name: z
          .string()
          .min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD })
          .max(75, { message: "This name is too long" }),
        service_description: z.string(),
        service_cost: z.string().min(1, { message: ERROR_MESSAGE.REQUIRED_FIELD }),
        selected_carwash_id: z.string(),
      });

      const { data: validatedFormData, error: validationFormErrors } =
        formSchema.safeParse(formData);

      if (validationFormErrors) {
        return json({ errors: validationFormErrors.flatten().fieldErrors });
      }

      const { formattedCurrency: formattedServiceCost } = convertCurrencyToNumber({
        currency: validatedFormData.service_cost,
      });

      const { service } = await createCarwashService({
        data: {
          ...validatedFormData,
          service_cost: formattedServiceCost,
          carwash_id: validatedFormData.selected_carwash_id,
        },
      });

      return json({ service, success: true });
    }

    case "DELETE": {
      const formData = Object.fromEntries(await request.formData());

      const formSchema = z.object({
        service_id: z.string(),
      });

      const { data: validatedFormData, error: validationFormErrors } =
        formSchema.safeParse(formData);

      if (validationFormErrors) {
        return json({ errors: validationFormErrors.flatten().fieldErrors });
      }

      await deleteCarwashService({ service_id: validatedFormData.service_id });

      return json({ success: true });
    }
  }
};

export default function CarwashServicesRoute() {
  const { carwash, carwashes } = useLoaderData<LoaderData>();

  const needsServices = carwash.services.length === 0;

  return (
    <>
      {needsServices ? (
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

          <CreateServiceModal
            carwash={carwash as unknown as CarwashWithOwnerServicesAndPackages}
            variant="primary"
            carwashes={carwashes as unknown as CarwashWithOwnerServicesAndPackages[]}
            currentCarwash={carwash as unknown as CarwashWithOwnerServicesAndPackages}
          />
        </div>
      ) : (
        <CarwashServicesTable
          services={carwash.services as unknown as CarwashServiceWithCarwash[]}
        />
      )}
    </>
  );
}
