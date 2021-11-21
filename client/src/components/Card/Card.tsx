import { FC, memo, useCallback } from "react";

import { Indicator, Button } from "../UIKit";

import { Command, Sensor } from "../../types";

import styles from "./Card.module.css";

type Props = {
  sensor: Sensor;
  toggleState: (command: Command) => void;
};

export const Card: FC<Props> = memo(
  ({ sensor: { id, name, connected, unit, value }, toggleState }) => {
    const handleButtonClick = useCallback(() => {
      toggleState({ command: connected ? "disconnect" : "connect", id });
    }, [id, connected, toggleState]);

    return (
      <div className={styles.card}>
        <div className={styles.indicator}>
          <Indicator isActive={connected} />
        </div>
        <div className={styles.title}>{name}</div>
        {value && (
          <div className={styles.description}>
            {value}
            <span className={styles.unit}>{unit}</span>
          </div>
        )}
        <div className={styles.button}>
          <Button color="primary" size="normal" onClick={handleButtonClick}>
            {connected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </div>
    );
  }
);
