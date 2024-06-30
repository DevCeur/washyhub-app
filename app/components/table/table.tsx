import styles from "./table.module.css";

interface TableProps {
  children: React.ReactNode;
}

export const Table = ({ children }: TableProps) => {
  return <table className={styles.container}>{children}</table>;
};
