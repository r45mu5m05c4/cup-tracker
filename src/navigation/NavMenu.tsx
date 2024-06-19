import { useState } from "react";
import styled from "styled-components";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

interface LeftBarProps {
  $expanded: boolean;
}

const NavMenu = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const navigate = useNavigate();
  const isTeamAdmin = false;
  const isCupAdmin = false;
  const isAdmin = false;

  return (
    <LeftBar $expanded={isExpanded}>
      {isExpanded ? (
        <StyledChevronLeftIcon onClick={() => setIsExpanded(!isExpanded)} />
      ) : (
        <StyledChevronRightIcon onClick={() => setIsExpanded(!isExpanded)} />
      )}

      {isExpanded && (
        <>
          <Link href="/" onClick={() => navigate("/")}>
            News
          </Link>
          <Link href="/games" onClick={() => navigate("/games")}>
            Games
          </Link>
          <Link href="/players" onClick={() => navigate("/players")}>
            Player stats
          </Link>
          <Link href="/teams" onClick={() => navigate("/teams")}>
            Team stats
          </Link>
          {isTeamAdmin && (
            <Link href="/my-team" onClick={() => navigate("/my-team")}>
              My team
            </Link>
          )}
          {isCupAdmin && (
            <Link href="/manage-cup" onClick={() => navigate("/manage-cup")}>
              Manage cup
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" onClick={() => navigate("/admin")}>
              Super admin tools
            </Link>
          )}
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
const Link = styled.a`
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
