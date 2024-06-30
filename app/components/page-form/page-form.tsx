import { useNavigate } from "@remix-run/react";

import { IoIosArrowRoundBack } from "react-icons/io";

import { Button } from "../button";

import styles from "./page-form.module.css";

interface PageFormProps {
  title: string;
  caption?: string;
  showGoBack?: boolean;
  children: React.ReactNode;
}

export const PageForm = ({ title, showGoBack, caption, children }: PageFormProps) => {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>

          {caption && <p className={styles.caption}>{caption}</p>}
        </div>

        <div className={styles.form_container}>{children}</div>
      </div>

      {showGoBack && (
        <Button
          icon={IoIosArrowRoundBack}
          onClick={() => navigate(-1)}
          hierarchy="tertiary"
          size="small"
        >
          Go Back
        </Button>
      )}
    </div>
  );
};
