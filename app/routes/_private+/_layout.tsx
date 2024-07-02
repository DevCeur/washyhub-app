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

import {
  commitSession,
  getCurrentCarwashId,
  getCurrentCarwashSession,
} from "~/utils/sessions/current-carwash-session";

import { getAuthUser } from "~/services/user";
import { getUserProfile } from "~/services/profile";
import { getAllUserCarwashes, getCurrentCarwash } from "~/services/carwash";

import { Logo } from "~/components/logo";
import { Button } from "~/components/button";
import { SideNavlink } from "~/components/side-navlink";
import { ThemeSwitch } from "~/components/theme-switch";
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
  currentCarwash: Carwash;
  carwashes: Carwash[];
}

export const loader: LoaderFunction = async ({ request }) => {
  const { currentCarwashSession } = await getCurrentCarwashSession({ request });

  const { carwashId } = await getCurrentCarwashId({ request });

  const { user } = await getAuthUser({ request });
  const { profile } = await getUserProfile({ request });
  const { carwashes } = await getAllUserCarwashes({ request });
  const { carwash } = await getCurrentCarwash({ request });

  if (!carwashId) {
    currentCarwashSession.set("carwashId", carwashes[0].id);
  }

  return json(
    { user, profile, carwashes, currentCarwash: carwash },
    { headers: { "Set-Cookie": await commitSession(currentCarwashSession) } }
  );
};

export default function PrivateLayout() {
  const { user, profile, carwashes, currentCarwash } = useLoaderData<Loader>();

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.logo_container}>
          <Link to={ROUTE.HOME} className={styles.logo}>
            <Logo />
          </Link>

          <ThemeSwitch />
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
            currentCarwash={currentCarwash as unknown as Carwash}
            carwashes={carwashes as unknown as Carwash[]}
          />

          <Button icon={FiPlus}>Create Order</Button>
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
