import type { ReactNode } from "react";
import clsx from "clsx";
import styles from "./style.module.css";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

type HeadingSize = "sm" | "md" | "lg";

type HeadingProps = {
  as?: HeadingTag;
  children: ReactNode;
  size?: HeadingSize;
  className?: string;
};

export function Heading({
  as: Tag = "h2",
  size = "md",
  className,
  children,
  ...props
}: HeadingProps) {
  return (
    <Tag className={(clsx(styles.heading), styles[size], className)} {...props}>
      {children}
    </Tag>
  );
}
