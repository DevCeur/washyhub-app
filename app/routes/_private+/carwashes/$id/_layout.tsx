import clsx from "clsx";
import React from "react";

import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useLocation } from "@remix-run/react";
import { Tab as HTab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import { FiPlus } from "react-icons/fi";

import type { LoaderFunction } from "@remix-run/node";
import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import { getCarwashById } from "~/services/carwash";

import { Button } from "~/components/button";
import { MessageCard } from "~/components/message-card";

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

  return json({ carwash });
};

export default function CarwashRouteLayout() {
  const location = useLocation();

  const { carwash } = useLoaderData<{ carwash: CarwashWithOwnerServicesAndPackages }>();

  const isInServices = location.pathname.includes("services");
  const isInPackages = location.pathname.includes("packages");

  const needsSetup =
    carwash.services?.length === 0 &&
    location.pathname === `${ROUTE.CARWASHES}/${carwash.id}/general`;

  return (
    <TabGroup className={styles.container}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <h1>{carwash.name} settings</h1>

          {isInServices && (
            <Button size="small" hierarchy="secondary" icon={FiPlus}>
              Create Service
            </Button>
          )}

          {isInPackages && (
            <Button size="small" hierarchy="secondary" icon={FiPlus}>
              Create Package
            </Button>
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
