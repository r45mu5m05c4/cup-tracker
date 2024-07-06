import React, { FC, ReactNode, useState } from "react";
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

type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
};

const Table: FC<TableProps<any>> = ({ data, columns, className }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<any> | null>(null);

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const requestSort = (key: keyof any) => {
    let direction: "asc" | "desc" = "desc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <ScrollableWrapper>
      <TableContainer className={className}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <TableHeader
                key={index}
                sticky={index === 0}
                onClick={() => requestSort(column.key)}
              >
                {column.header}
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData ? (
            sortedData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sticky={colIndex === 0}
                    isLogo={column.key === "logo"}
                  >
                    {column.render
                      ? column.render(item[column.key])
                      : item[column.key]}
                  </TableCell>
                ))}
              </tr>
            ))
          ) : (
            <NoDataText>No data</NoDataText>
          )}
        </tbody>
      </TableContainer>
    </ScrollableWrapper>
  );
};

export default Table;

const ScrollableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;
const NoDataText = styled.h2`
  margin: auto;
`;
const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: .9em;
  padding: 6px;
`;

const TableHeader = styled.th.withConfig({
  shouldForwardProp: (prop) => prop !== "sticky",
}) <{ sticky: boolean }>`
  padding: 8px;
  text-align: left;
  border-bottom: 2px solid var(--neutral-border-onContrast);
  background: var(--neutral-surface-contrast);
  position: ${({ sticky }) => (sticky ? "sticky" : "static")};
  left: ${({ sticky }) => (sticky ? "0" : "auto")};
  z-index: ${({ sticky }) => (sticky ? "1" : "auto")};
  cursor: pointer;
`;

const TableCell = styled.td.withConfig({
  shouldForwardProp: (prop) => prop !== "sticky" && prop !== "isLogo",
}) <{ sticky: boolean; isLogo: boolean }>`
  padding: 8px 14px;
  padding-right: ${({ isLogo }) => (isLogo ? "0" : "8px")};
  width: ${({ isLogo }) => (isLogo ? "1%" : "8px")};
  border-bottom: 1px solid var(--neutral-border-onContrast);
  background: var(--neutral-surface-contrast);
  position: ${({ sticky }) => (sticky ? "sticky" : "static")};
  left: ${({ sticky }) => (sticky ? "0" : "auto")};
  z-index: ${({ sticky }) => (sticky ? "1" : "auto")};
  text-wrap: nowrap;
`;
