import { FiEdit3 } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";

import type { CarwashService } from "@prisma/client";

import { formatCurrencyToString } from "~/utils/currency";

import { Table } from "../table";
import { Button } from "../button";
import { TableBody } from "../table/table-body";
import { TableHeader } from "../table/table-header";

import styles from "./carwash-services-table.module.css";

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
        <th scope="col" className={styles.actions_cell}>
          Actions
        </th>
      </TableHeader>

      <TableBody>
        {services.map(({ id, name, description, cost }) => {
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
              <td className={styles.actions_cell}>
                <Button
                  icon={FaRegTrashCan}
                  size="small"
                  hierarchy="tertiary"
                  variant="error"
                />
                <Button icon={FiEdit3} size="small" hierarchy="tertiary" />
              </td>
            </tr>
          );
        })}
      </TableBody>
    </Table>
  );
};
