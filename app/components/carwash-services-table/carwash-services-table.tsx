import { Link, useLoaderData, useLocation } from "@remix-run/react";

import type {
  CarwashServiceWithCarwash,
  CarwashWithOwnerServicesAndPackages,
} from "~/utils/types";
import type { LoaderData } from "~/routes/_private+/carwashes/$carwashId/_layout";

import { formatCurrencyToString } from "~/utils/currency";

import { Table } from "../table";
import { TableBody } from "../table/table-body";
import { TableHeader } from "../table/table-header";

import { DeleteServiceModal } from "../modals/delete-service-modal";
import { UpdateServiceModal } from "../modals/update-service-modal";

import styles from "./carwash-services-table.module.css";

interface CarwashServicesTableProps {
  services: CarwashServiceWithCarwash[];
}

export const CarwashServicesTable = ({
  services,
}: CarwashServicesTableProps) => {
  const location = useLocation();

  const { carwashes } = useLoaderData<LoaderData>();

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
                <DeleteServiceModal
                  from="modal"
                  variant="card"
                  service={service}
                />

                <UpdateServiceModal
                  variant="card"
                  service={service}
                  carwashes={
                    carwashes as unknown as CarwashWithOwnerServicesAndPackages[]
                  }
                />
              </td>
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
};
