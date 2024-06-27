import styles from "./table-header.module.css";

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
  return (
    <thead className={styles.table_header}>
      <tr className={styles.table_header_content}>{children}</tr>
    </thead>
  );
};
