import { useState } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

import { Link } from "react-router-dom";

interface LeftBarProps {
  $expanded: boolean;
}

const NavMenu = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isTeamAdmin = false;
  const isCupAdmin = false;
  const isAdmin = true;

  return (
    <LeftBar $expanded={isExpanded}>
      {isExpanded ? (
        <StyledChevronLeftIcon onClick={() => setIsExpanded(!isExpanded)} />
      ) : (
        <StyledChevronRightIcon onClick={() => setIsExpanded(!isExpanded)} />
      )}

      {isExpanded && (
        <>
          <StyledLink to="/">News</StyledLink>
          <StyledLink to="/games">Games</StyledLink>
          <StyledLink to="/players">Player stats</StyledLink>
          <StyledLink to="/teams">Team stats</StyledLink>
          {isTeamAdmin && <StyledLink to="/games">My team</StyledLink>}
          {isCupAdmin && <StyledLink to="/games">Manage cup</StyledLink>}
          {isAdmin && <StyledLink to="/admin">Super admin tools</StyledLink>}
        </>
      )}
    </LeftBar>
  );
};
export default NavMenu;

const LeftBar = styled.div<LeftBarProps>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$expanded ? "20%" : "30px")};
  border-right: solid 1px #007bff;
  height: 100vh;
`;
const StyledChevronRightIcon = styled(ChevronRightIcon)`
  margin: 5%;
  margin-left: auto;
  height: 30px;
  width: 30px;
  &:hover {
    cursor: pointer;
  }
`;
const StyledChevronLeftIcon = styled(ChevronLeftIcon)`
  margin: 5%;
  margin-left: auto;
  height: 30px;
  width: 30px;
  &:hover {
    cursor: pointer;
  }
`;
const StyledLink = styled(Link)`
  width: 100%;
  height: 64px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #007bff;
  &:hover {
    background-color: #0056b3;
    color: #fff;
  }
  &:first-of-type {
    border-top: 1px solid #007bff;
  }
`;
