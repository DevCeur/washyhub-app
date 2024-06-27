import dayjs from "dayjs";

import type { CarwashService } from "@prisma/client";

import { Table } from "../table";
import { TableBody } from "../table/table-body";
import { TableHeader } from "../table/table-header";

import styles from "./carwash-services-table.module.css";
import { formatCurrencyToString } from "~/utils/currency";

interface CarwashServicesTableProps {
  services: CarwashService[];
}

export const CarwashServicesTable = ({
  services,
}: CarwashServicesTableProps) => {
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
        <th scope="col" className={styles.created_cell}>
          Created
        </th>
      </TableHeader>

      <TableBody>
        {services.map(({ id, name, description, cost, created_at }) => {
          const { formattedCurrency: formattedCost } = formatCurrencyToString({
            currency: cost,
          });

          return (
            <tr key={id}>
              <th scope="row" className={styles.name_cell}>
                {name}
              </th>
              <td className={styles.description_cell}>
                <div className={styles.description}>{description}</div>
              </td>
              <td>{formattedCost}</td>
              <td className={styles.created_cell}>
                {dayjs(new Date(created_at)).from(new Date())}
              </td>
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
};
