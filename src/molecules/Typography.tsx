import { CSSProperties, ReactNode } from "react";

interface TypographyProps {
  variant?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}

export const Typography = ({
  variant = "p",
  color,
  children,
  style,
}: TypographyProps) => {
  const Element = variant;

  return (
    <Element color={color} style={{ margin: 0, ...style }}>
      {children}
    </Element>
  );
};
