import clsx from "clsx";
import React from "react";

import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Tab as HTab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import type { LoaderFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { getAllUserCarwashes, getCarwashById } from "~/services/carwash";

import { MessageCard } from "~/components/message-card";
import { CreateServiceModal } from "~/components/modals/create-service-modal";
import { CreatePackageModal } from "~/components/modals/create-package-modal";

import styles from "./layout.module.css";

interface TabProps {
  to: string;
  children: React.ReactNode;
}

const Tab = ({ to, children }: TabProps) => {
  const location = useLocation();

  const isInTab = location.pathname === to;

  return (
    <HTab as={Link} to={to} className={clsx(styles.tab, isInTab && styles.in_tab)}>
      {children}
    </HTab>
  );
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { id } = params;

  const { carwash } = await getCarwashById({ id: id as string, request });
  const { carwashes } = await getAllUserCarwashes({ request });

  return json({ carwash, carwashes });
};

export default function CarwashRouteLayout() {
  const location = useLocation();

  const { carwash, carwashes } = useLoaderData<{
    carwash: CarwashWithOwnerServicesAndPackages;
    carwashes: CarwashWithOwnerServicesAndPackages[];
  }>();

  const isInServices = location.pathname.includes("services");
  const isInPackages = location.pathname.includes("packages");

  const needsMoreServices = carwash.services.length < 2;
  const needsSetup =
    carwash.services?.length === 0 &&
    location.pathname === `${ROUTE.CARWASHES}/${carwash.id}/general`;

  return (
    <TabGroup className={styles.container}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h1>{carwash.name} settings</h1>

          {isInServices && (
            <CreateServiceModal
              variant="secondary"
              carwashes={carwashes as unknown as CarwashWithOwnerServicesAndPackages[]}
              currentCarwash={carwash as unknown as CarwashWithOwnerServicesAndPackages}
            />
          )}

          {isInPackages && !needsMoreServices && (
            <CreatePackageModal variant="secondary" />
          )}
        </div>

        <TabList className={styles.tabs_container}>
          <Tab to={`${ROUTE.CARWASHES}/${carwash.id}/general`}>General</Tab>

          <Tab to={`${ROUTE.CARWASHES}/${carwash.id}/services`}>Services</Tab>

          <Tab to={`${ROUTE.CARWASHES}/${carwash.id}/packages`}>Packages</Tab>
        </TabList>
      </div>

      {needsSetup && (
        <MessageCard type="warning" title="Carwash needs ">
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
