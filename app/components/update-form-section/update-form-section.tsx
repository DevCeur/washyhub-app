import styles from "./update-form-section.module.css";

interface UpdateFormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const UpdateFormSection = ({
  title,
  description,
  children,
}: UpdateFormSectionProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        {title && <span className={styles.title}>{title}</span>}

        {description && <span className={styles.description}>{description}</span>}
      </div>

      <div className={styles.fields_container}>{children}</div>
    </div>
  );
};
