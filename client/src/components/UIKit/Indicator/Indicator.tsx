import { FC, memo } from "react";
import classNames from "classnames";

import styles from "./Indicator.module.css";

type Props = {
  isActive: boolean;
};

export const Indicator: FC<Props> = memo(({ isActive }) => (
  <span className={styles.wrapper}>
    <span
      className={classNames(styles.first, {
        [styles.active]: isActive,
        [styles.inactive]: !isActive,
      })}
    />
    <span
      className={classNames(styles.second, {
        [styles.active]: isActive,
        [styles.inactive]: !isActive,
      })}
    />
  </span>
));
