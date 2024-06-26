import clsx from "clsx";

import { useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";

import styles from "./global-loading.module.css";

export const GlobalLoading = () => {
  const navigation = useNavigation();
  const ref = useRef<HTMLDivElement>(null);

  const active = navigation.state !== "idle";
  const idle = navigation.state === "idle";
  const loading = navigation.state === "submitting";
  const loaded = navigation.state === "loading";

  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    if (!ref.current) return;

    if (active) setAnimationComplete(false);

    Promise.allSettled(
      ref.current.getAnimations().map(({ finished }) => finished)
    ).then(() => !active && setAnimationComplete(true));
  }, [active]);

  if (navigation.formMethod) {
    return <></>;
  }

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? "Loading" : undefined}
      className={styles.container}
    >
      <div
        ref={ref}
        className={clsx(
          styles.progress_bar,
          idle && animationComplete && styles.progress_bar_idle,
          loading && styles.progress_bar_loading,
          loaded && styles.progress_bar_loaded,
          idle && !animationComplete && styles.progress_bar_done
        )}
      />
    </div>
  );
};
