import { BaseSyntheticEvent, ReactElement } from "react";
import styled from "styled-components";

interface ButtonProps {
  children: string | ReactElement;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick: (e: BaseSyntheticEvent) => void;
}

export const Button = ({
  children,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) => (
  <StyledButton type={type} onClick={onClick} disabled={disabled}>
    {children}
  </StyledButton>
);

const StyledButton = styled.button`
  border-radius: 30px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 600;
  font-family: inherit;
  background-color: var(--decorative-brand-light);
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  text-decoration: none;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: #fff;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3c8271;
  }

  &:disabled {
    background-color: var(--disabled-surface-base);
    color: var(--disabled-text-base);
    cursor: auto;
  }
`;
