import { Link, useLocation } from "@remix-run/react";

import { FiEdit3 } from "react-icons/fi";

import type { CarwashService } from "@prisma/client";

import { formatCurrencyToString } from "~/utils/currency";

import { Table } from "../table";
import { Button } from "../button";
import { TableBody } from "../table/table-body";
import { TableHeader } from "../table/table-header";

import styles from "./carwash-services-table.module.css";
import { DeleteServiceModal } from "../modals/delete-service-modal";

interface CarwashServicesTableProps {
  services: CarwashService[];
}

export const CarwashServicesTable = ({ services }: CarwashServicesTableProps) => {
  const location = useLocation();

  return (
    <Table>
      <TableHeader>
        <th scope="col" className={styles.name_cell}>
          Name
        </th>
        <th scope="col" className={styles.description_cell}>
          Description
        </th>
        <th scope="col">Cost</th>
        <th scope="col" className={styles.actions_cell}>
          Actions
        </th>
      </TableHeader>

      <TableBody>
        {services.map((service) => {
          const { id, name, description, cost } = service;

          const { formattedCurrency: formattedCost } = formatCurrencyToString({
            currency: cost,
          });

          return (
            <tr key={id}>
              <th scope="row" className={styles.name_cell}>
                <Link to={`${location.pathname}/${id}`}>{name}</Link>
              </th>
              <td className={styles.description_cell}>
                <div className={styles.description}>{description}</div>
              </td>
              <td>{formattedCost}</td>
              <td className={styles.actions_cell}>
                <DeleteServiceModal variant="card" service={service} />

                <Button icon={FiEdit3} size="small" hierarchy="tertiary" />
              </td>
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
};
