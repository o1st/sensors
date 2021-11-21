import { FC, memo, ReactNode, useMemo } from "react";
import classNames from "classnames";

import styles from "./Button.module.css";

type Size = "auto" | "normal";
const sizeMap: { [key in Size]: string } = {
  auto: "",
  normal: styles.normal,
};

type Color = "primary" | "unstyled";
const colorClassMap: { [key in Color]: string } = {
  primary: styles.primary,
  unstyled: "",
};

const disabledColorClassMap: { [key in Color]: string } = {
  unstyled: "",
  primary: styles.primaryDisabled,
};

type Props = {
  color?: Color;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
};

export const Button: FC<Props> = memo(
  ({
    color = "unstyled",
    size = "normal",
    disabled = false,
    onClick,
    children,
  }: Readonly<Props>) => {
    const colors = useMemo(
      () => (disabled ? disabledColorClassMap[color] : colorClassMap[color]),
      [color, disabled]
    );

    return (
      <button
        className={classNames(styles.button, colors, sizeMap[size])}
        type="button"
        disabled={disabled}
        onClick={onClick}
      >
        <span className={styles.content}>{children}</span>
      </button>
    );
  }
);
