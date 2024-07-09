import React, { ReactNode, useState, useMemo } from "react";
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
  team?: boolean;
  small?: boolean;
};

type SortConfig<T> = {
  key: keyof T;
  direction: "asc" | "desc";
};

export const Table = ({
  data,
  columns,
  className,
  team,
  small,
}: TableProps<any>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<any>>({
    key: "points",
    direction: "desc",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");

  const filteredData = useMemo(() => {
    let filtered = data;
    if (teamFilter) {
      filtered = filtered.filter((item) => item.teamName === teamFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [data, teamFilter, searchQuery]);

  const sortedData = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredData].sort((a, b) => {
        const aValue =
          sortConfig.key === "points" ? a.goals + a.assists : a[sortConfig.key];
        const bValue =
          sortConfig.key === "points" ? b.goals + b.assists : b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredData;
  }, [filteredData, sortConfig]);

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTeamFilter(event.target.value);
  };

  return (
    <>
      {!small && (
        <FilterContainer>
          <SearchInput
            name="search-field"
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {!team && (
            <TeamFilter name="team-filter" onChange={handleFilterChange}>
              <Option value="">All Teams</Option>
              {[...new Set(data.map((item) => item.teamName))].map(
                (team, i) => (
                  <Option key={i} value={team}>
                    {team}
                  </Option>
                )
              )}
            </TeamFilter>
          )}
        </FilterContainer>
      )}
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
    </>
  );
};

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  padding: 8px;
  font-size: 1em;
  border-bottom: 1px solid var(--neutral-border-onContrast);
  border-radius: 0;
  background-color: transparent;
  color: #fff;
  margin-right: 5px;
  &:focus {
    outline: none;
    border-bottom: 2px solid white;
  }
`;

const TeamFilter = styled.select`
  padding: 8px;
  font-size: 1em;
  border: none;
  border-bottom: 1px solid var(--neutral-border-onContrast);
  border-radius: 0;
  background-color: var(--neutral-surface-base); /* Ensure background is set */
  color: #fff;
  &:focus {
    outline: none;
  }
`;

const Option = styled.option`
  background-color: var(--neutral-surface-base);
  padding: 15px;
  border: none;
  color: #fff;
  &:hover {
    background-color: var(--neutral-surface-contrast);
  }
`;

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
  font-size: 0.9em;
  padding: 6px;
`;

const TableHeader = styled.th.withConfig({
  shouldForwardProp: (prop) => prop !== "sticky",
})<{ sticky: boolean }>`
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
})<{ sticky: boolean; isLogo: boolean }>`
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
