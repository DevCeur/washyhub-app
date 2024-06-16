import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";

import { FiPlus } from "react-icons/fi";
import { IoExitOutline } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { LuTicket } from "react-icons/lu";
import { GoOrganization } from "react-icons/go";
import { TbReceipt2 } from "react-icons/tb";

import type { Profile } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import type { IconType } from "react-icons";

import { ROUTE } from "~/utils/enum";

import { getUserProfile } from "~/services/profile";

import { Logo } from "~/components/logo";
import { Button } from "~/components/button";
import { SideNavlink } from "~/components/side-navlink";

import styles from "./layout.module.css";

const SIDE_MAIN_LINKS: { href: string; text: string; icon: IconType }[] = [
  { href: ROUTE.DASHBOARD, text: "Dashboard", icon: RxDashboard },
  { href: ROUTE.ORDERS, text: "Orders", icon: LuTicket },
  { href: ROUTE.ORGANIZATIONS, text: "Organizations", icon: GoOrganization },
  { href: ROUTE.INVOICES, text: "Invoices", icon: TbReceipt2 },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { profile } = await getUserProfile({ request });

  return json({ profile });
};

export default function PrivateLayout() {
  const { profile } = useLoaderData<{ profile: Profile }>();

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo_container}>
          <Link to={ROUTE.HOME} className={styles.logo}>
            <Logo />
          </Link>
        </div>

        <nav className={styles.links_container}>
          <div className={styles.main_links}>
            {SIDE_MAIN_LINKS.map(({ href, ...link }) => (
              <SideNavlink key={href} to={href} {...link} />
            ))}
          </div>

          <div className={styles.extra_links_container}>
            <Link to={ROUTE.ACCOUNT} className={styles.account_link}>
              <div className={styles.account_initial}>{profile.first_name.charAt(0)}</div>

              <span className={styles.account_first_name}>{profile.first_name}</span>
            </Link>

            <Form action="/sign-out" method="post">
              <Button icon={IoExitOutline} type="submit" hierarchy="tertiary" />
            </Form>
          </div>
        </nav>
      </div>

      <div className={styles.content_container}>
        <header className={styles.header}>
          <Button size="small" hierarchy="secondary">
            Select Organization
          </Button>

          <Button
            as="link"
            href={ROUTE.CREATE_ORDER}
            icon={FiPlus}
            size="small"
            hierarchy="secondary"
          >
            Create Order
          </Button>
        </header>

        <main className={styles.content_wrapper}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
