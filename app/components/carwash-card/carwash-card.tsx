import { Link } from "@remix-run/react";

import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineLocalCarWash } from "react-icons/md";
import { HiChevronRight } from "react-icons/hi";
import { TbAlertCircle } from "react-icons/tb";

import type { CarwashWithOwnerServicesAndPackages } from "~/utils/types";

import { ROUTE } from "~/utils/enum";

import styles from "./carwash-card.module.css";

interface CarwashCardProps {
  carwash: CarwashWithOwnerServicesAndPackages;
}

export const CarwashCard = ({ carwash }: CarwashCardProps) => {
  const ownerName = `${carwash.owner.profile.first_name} ${carwash.owner.profile.last_name}`;

  const needsSetup = carwash.services.length === 0;

  return (
    <li className={styles.item}>
      <Link to={`${ROUTE.CARWASHES}/${carwash.id}/general`} className={styles.container}>
        <div className={styles.header}>
          <span className={styles.carwash_name}>{carwash.name}</span>

          <HiChevronRight />
        </div>

        <div className={styles.carwash_info}>
          <div className={styles.carwash_owner}>
            <FaRegUserCircle />

            <span>{ownerName}</span>
          </div>

          <div className={styles.carwash_stats}>
            {needsSetup ? (
              <div className={styles.needs_setup_badge}>
                <TbAlertCircle />

                <span>Needs Setup</span>
              </div>
            ) : (
              <div className={styles.stat}>
                <MdOutlineLocalCarWash /> <span>12</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
};
