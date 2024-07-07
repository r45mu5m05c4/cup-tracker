import { ComponentType, forwardRef } from "react";
import styled from "styled-components";

interface IconButtonProps {
  Icon: ComponentType;
  onClick: () => void;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ Icon, onClick }, ref) {
    return (
      <StyledButton ref={ref} onClick={onClick}>
        {<Icon />}
      </StyledButton>
    );
  }
);

const StyledButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;

  &:active {
    border-color: var(--neutral-border-base);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid white;
  }

  svg {
    color: var(--text-base);
    width: 38px;
    min-width: 38px;
    height: 38px;

    &:hover {
      color: var(--decorative-brand-light);
    }
  }
`;
