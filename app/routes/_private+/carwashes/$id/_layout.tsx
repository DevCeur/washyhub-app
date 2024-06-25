import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import type { LoaderFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { getCarwashById } from "~/services/carwash";

import { MessageCard } from "~/components/message-card";

import styles from "./layout.module.css";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;

  const { carwash } = await getCarwashById({ id: id as string, request });

  return json({ carwash });
};

export default function CarwashRouteLayout() {
  const location = useLocation();

  const { carwash } = useLoaderData<{ carwash: CarwashWithOwnerServicesAndPackages }>();

  const needsSetup =
    carwash.services?.length === 0 &&
    location.pathname === `${ROUTE.CARWASHES}/${carwash.id}/general`;

  return (
    <TabGroup className={styles.container}>
      <div className={styles.header}>
        <h1>{carwash.name} settings</h1>

        <TabList className={styles.tabs_container}>
          <Tab
            as={Link}
            to={`${ROUTE.CARWASHES}/${carwash.id}/general`}
            className={styles.tab}
          >
            General
          </Tab>

          <Tab
            as={Link}
            to={`${ROUTE.CARWASHES}/${carwash.id}/services`}
            className={styles.tab}
          >
            Services
          </Tab>

          <Tab
            as={Link}
            to={`${ROUTE.CARWASHES}/${carwash.id}/packages`}
            className={styles.tab}
          >
            Packages
          </Tab>
        </TabList>
      </div>

      {needsSetup && (
        <MessageCard type="warning" title="Carwash Needs Setup">
          <span>
            Looks like this Carwash needs some services to enable order creation and more,{" "}
            <Link to={`${ROUTE.CARWASHES}/${carwash.id}/services`}>
              create your services now!
            </Link>
          </span>
        </MessageCard>
      )}

      <TabPanels className={styles.content}>
        <TabPanel>
          <Outlet />
        </TabPanel>

        <TabPanel>
          <Outlet />
        </TabPanel>

        <TabPanel>
          <Outlet />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
