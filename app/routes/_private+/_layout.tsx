import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";

import { FiPlus } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { LuTicket } from "react-icons/lu";
import { GoOrganization } from "react-icons/go";
import { TbReceipt2 } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi2";

import type { Carwash, Profile, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import type { IconType } from "react-icons";

import { ROUTE } from "~/utils/enum";

import { getAuthUser } from "~/services/user";
import { getUserProfile } from "~/services/profile";
import { getAllUserCarwashes } from "~/services/carwash";

import { Logo } from "~/components/logo";
import { Button } from "~/components/button";
import { SideNavlink } from "~/components/side-navlink";
import { AccountSettingsListbox } from "~/components/account-settings-listbox";
import { CarwashSelectionListbox } from "~/components/carwash-selection-listbox";

import styles from "./layout.module.css";

const SIDE_MAIN_LINKS: { href: string; text: string; icon: IconType }[] = [
  { href: ROUTE.DASHBOARD, text: "Dashboard", icon: RxDashboard },
  { href: ROUTE.CARWASHES, text: "Carwashes", icon: GoOrganization },
  { href: ROUTE.ORDERS, text: "Orders", icon: LuTicket },
  { href: ROUTE.CUSTOMERS, text: "Customers", icon: HiOutlineUserGroup },
  { href: ROUTE.INVOICES, text: "Invoices", icon: TbReceipt2 },
];

interface Loader {
  user: User;
  profile: Profile;
  carwashes: Carwash[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const { user } = await getAuthUser({ request });
  const { profile } = await getUserProfile({ request });
  const { carwashes } = await getAllUserCarwashes({ request });

  return json({ user, profile, carwashes });
};

export default function PrivateLayout() {
  const { user, profile, carwashes } = useLoaderData<Loader>();

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
            <AccountSettingsListbox
              user={user as unknown as User}
              profile={profile as unknown as Profile}
            />
          </div>
        </nav>
      </div>

      <div className={styles.content_container}>
        <header className={styles.header}>
          <CarwashSelectionListbox
            carwashes={carwashes as unknown as Carwash[]}
          />

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
