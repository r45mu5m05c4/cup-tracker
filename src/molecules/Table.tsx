import { FC, ReactNode } from "react";
import styled from "styled-components";

type TableColumn<T> = {
  key: keyof T; 
  header: string; 
  render?: (value: T[keyof T]) => ReactNode; 
};

type TableProps<T> = {
  data: T[]; 
  columns: TableColumn<T>[];
  className?: string; 
};

const ScrollableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

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

const Table: FC<TableProps<any>> = ({ data, columns, className }) => {
  return (
    <ScrollableWrapper>
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
    </ScrollableWrapper>
  );
};

export default Table;
