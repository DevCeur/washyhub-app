import { Link } from "@remix-run/react";

import { FiPackage } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { MdOutlineLocalCarWash } from "react-icons/md";
import { HiChevronRight } from "react-icons/hi";

import type { Carwash } from "@prisma/client";

import { ROUTE } from "~/utils/enum";

import styles from "./carwash-card.module.css";

interface CarwashCardProps {
  carwash: Carwash;
}

export const CarwashCard = ({ carwash }: CarwashCardProps) => {
  return (
    <li className={styles.item}>
      <Link to={`${ROUTE.CARWASHES}/${carwash.id}`} className={styles.container}>
        <div className={styles.header}>
          <span className={styles.carwash_name}>{carwash.name}</span>

          <HiChevronRight />
        </div>

        <div className={styles.carwash_info}>
          <div className={styles.carwash_owner}>
            <FaRegUserCircle />
            <span>Owner Name</span>
          </div>

          <div className={styles.carwash_stats}>
            <div className={styles.stat}>
              <MdOutlineLocalCarWash /> <span>12</span>
            </div>

            <div className={styles.stat}>
              <FiPackage /> <span>12</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
