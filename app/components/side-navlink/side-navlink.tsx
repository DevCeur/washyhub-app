import clsx from "clsx";

import { Link, useLocation } from "@remix-run/react";

import type { LinkProps } from "@remix-run/react";
import type { IconType } from "react-icons";

import styles from "./side-navlink.module.css";

interface SideNavlinkProps extends LinkProps {
  icon: IconType;
  text: string;
}

export const SideNavlink = ({ text, to, icon: Icon, ...linkProps }: SideNavlinkProps) => {
  const location = useLocation();

  const isInRoute = to === location.pathname;

  return (
    <Link
      to={to}
      className={clsx(styles.link, isInRoute && styles.link_active)}
      {...linkProps}
    >
      <Icon />

      <span>{text}</span>
    </Link>
  );
};
