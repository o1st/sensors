import { FC, memo, useCallback } from "react";
import classNames from "classnames";

import styles from "./Toggle.module.css";

type Props = {
  checked: boolean;
  name: string;
  label: {
    checked: string;
    unChecked: string;
  };
  onChange?: (value: boolean) => void;
};

export const Toggle: FC<Props> = memo(
  ({ name, checked, label, onChange }: Props) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event.target.checked);
      },
      [onChange]
    );

    return (
      <label htmlFor={name} className={styles.toggle}>
        <input
          id={name}
          type="checkbox"
          className={styles.input}
          checked={checked}
          onChange={handleChange}
        />
        <span>{label.unChecked}</span>
        <span
          className={classNames(styles.wrapper, {
            [styles.checked]: checked,
            [styles.unchecked]: !checked,
          })}
        >
          <span
            className={classNames(styles.circle, {
              [styles.circleChecked]: checked,
            })}
          />
        </span>
        <span>{label.checked}</span>
      </label>
    );
  }
);
