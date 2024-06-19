import { FC, ReactNode } from "react";
import styled from "styled-components";

// Define types for table data and column configuration
type TableColumn<T> = {
  key: keyof T; // Key of the data object
  header: string; // Header text for the column
  render?: (value: T[keyof T]) => ReactNode; // Optional custom renderer for cell content
};

type TableProps<T> = {
  data: T[]; // Array of data objects
  columns: TableColumn<T>[]; // Array of column configurations
  className?: string; // Optional class name for additional styling
};

// Styled components for the table
const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #ddd;
`;

// Reusable Table component
const Table: FC<TableProps<any>> = ({ data, columns, className }) => {
  return (
    <TableContainer className={className}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <TableHeader key={index}>{column.header}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <TableCell key={colIndex}>
                {column.render
                  ? column.render(item[column.key])
                  : item[column.key]}
              </TableCell>
            ))}
          </tr>
        ))}
      </tbody>
    </TableContainer>
  );
};

export default Table;
