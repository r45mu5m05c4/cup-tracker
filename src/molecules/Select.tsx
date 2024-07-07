import { ChangeEventHandler, SelectHTMLAttributes } from "react";
import styled from "styled-components";
import { Typography } from "./Typography";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

export const Select = ({
  label,
  options,
  placeholder,
  onChange,
}: SelectProps) => {
  return (
    <Container>
      {label && <Typography style={{ fontWeight: "500" }}>{label}</Typography>}
      <StyledSelect onChange={onChange}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledSelect = styled.select`
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  width: 260px;
  padding: 8px;
  border-radius: 6px;
  border: none;

  &:hover {
    cursor: pointer;
  }
`;
