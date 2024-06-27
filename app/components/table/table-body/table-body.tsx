import styles from "./table-body.module.css";

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return <tbody className={styles.table_body}>{children}</tbody>;
};
