import { FC, memo } from "react";

import { Toggle } from "../UIKit";

import styles from "./Header.module.css";

type Props = {
  isAll: boolean;
  toggleShow: (value: boolean) => void;
};

export const Header: FC<Props> = memo(({ isAll, toggleShow }) => (
  <header className={styles.header}>
    <h1 className={styles.title}>Sensors Management</h1>
    <Toggle
      checked={isAll}
      name="switch-all"
      onChange={toggleShow}
      label={{ checked: "Show All", unChecked: "Show connected" }}
    />
  </header>
));
