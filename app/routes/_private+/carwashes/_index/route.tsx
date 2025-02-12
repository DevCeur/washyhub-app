import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { FiPlus } from "react-icons/fi";

import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { getAllUserCarwashes } from "~/services/carwash";

import { withAuthLoader } from "~/utils/with-auth-loader";

import { CarwashCard } from "~/components/carwash-card";
import { Button } from "~/components/button";

import styles from "./route.module.css";

interface LoaderData {
  carwashes: CarwashWithOwnerServicesAndPackages[];
}

export const loader: LoaderFunction = (loaderArgs) =>
  withAuthLoader({
    loaderArgs,
    callback: async ({ request }) => {
      const { carwashes } = await getAllUserCarwashes({ request });

      return json({ carwashes });
    },
  });

export const meta: MetaFunction<typeof loader> = () => {
  return [{ title: "Carwashes" }];
};

export default function CarwashesRoute() {
  const { carwashes } = useLoaderData<LoaderData>();

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h1>Carwashes</h1>

        <Button
          as="link"
          size="small"
          hierarchy="secondary"
          href={ROUTE.NEW_CARWASH}
          icon={FiPlus}
        >
          Create Carwash
        </Button>
      </div>

      <ul className={styles.carwashes_list}>
        {carwashes.map((carwash) => (
          <CarwashCard
            key={carwash.id}
            carwash={carwash as unknown as CarwashWithOwnerServicesAndPackages}
          />
        ))}
      </ul>
    </div>
  );
}
