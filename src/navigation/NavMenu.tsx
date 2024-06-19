import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { ArrowDownTrayIcon, } from "@heroicons/react/20/solid";
import { NewspaperIcon, BoltIcon, PresentationChartBarIcon, PresentationChartLineIcon, TrophyIcon } from "@heroicons/react/24/outline";

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
      <NavContent>
        <NavHeader>
          <LogoContainer>
            <StyledTrophyIcon />
          </LogoContainer>
          {isExpanded ? <h3>Cup Manager</h3> : ""}
        </NavHeader>

        <NavLinks>
          <Link href="/" onClick={() => navigate("/")} $expanded={isExpanded}>
            <StyledLinkIcon />
            {isExpanded ? "News" : ""}
          </Link>
          <Link href="/games" onClick={() => navigate("/games")} $expanded={isExpanded}>
            <StyledGamesIcon />
            {isExpanded ? "Games" : ""}
          </Link>
          <Link href="/players" onClick={() => navigate("/players")} $expanded={isExpanded}>
            <StyledPlayerStatsIcon />
            {isExpanded ? "Player stats" : ""}
          </Link>
          <Link href="/teams" onClick={() => navigate("/teams")} $expanded={isExpanded}>
            <StyledTeamStatsIcon />
            {isExpanded ? "Team stats" : ""}
          </Link>
          {isTeamAdmin && (
            <Link href="/my-team" onClick={() => navigate("/my-team")} $expanded={isExpanded}>
              {isExpanded ? "My team" : ""}
            </Link>
          )}
          {isCupAdmin && (
            <Link href="/manage-cup" onClick={() => navigate("/manage-cup")} $expanded={isExpanded}>
              Manage cup
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" onClick={() => navigate("/admin")} $expanded={isExpanded}>
              Super admin tools
            </Link>
          )}
        </NavLinks>
      </NavContent>

      <NavFooter>
        {isExpanded ? (
          <HideSideMenuButton onClick={() => setIsExpanded(!isExpanded)} >
            <StyledChevronRightIcon />
            Hide sidemenu
          </HideSideMenuButton>
        ) : (
          <StyledChevronLeftIcon onClick={() => setIsExpanded(!isExpanded)} />
        )}
      </NavFooter>
    </LeftBar>
  )
};
export default NavMenu;

const LeftBar = styled.div<LeftBarProps>`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.$expanded ? "260px" : "80px")};
  min-width: ${(props) => (props.$expanded ? "260px" : "80px")};
  background-color: var(--color-background-secondary);
  border-top-right-radius: 30px;
  height: 100vh;
  justify-content: space-between;
`;
const NavContent = styled('div')`
display: flex;
flex-direction: column;
`;
const NavHeader = styled('div')`
display: flex;
gap: 12px;
align-items: center;
padding: 16px;
color: var(--color-text-primary);
`;
const LogoContainer = styled('div')`
  background-color: #20286B;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
`;
const StyledTrophyIcon = styled(TrophyIcon)`
  width: 24px;
  height: 24px;
  margin: auto;
  margin-left: 5%;
  margin-right: 5%;
`;
const StyledChevronRightIcon = styled(ArrowDownTrayIcon)`
  margin: 5%;
  margin-left: auto;
  height: 24px;
  width: 24px;
  transform: rotate(0.25turn);
  color: var(--color-text-primary);

  &:hover {
    cursor: pointer;
  }
`;
const StyledChevronLeftIcon = styled(ArrowDownTrayIcon)`
  margin: 5%;
  margin-left: auto;
  height: 24px;
  width: 24px;
  transform: rotate(0.75turn);
  color: var(--color-text-primary);

  &:hover {
    cursor: pointer;
  }
`;
const StyledLinkIcon = styled(NewspaperIcon)`
  width: 24px;
  height: 24px;
`;
const StyledGamesIcon = styled(BoltIcon)`
  width: 24px;
  height: 24px;
`;
const StyledPlayerStatsIcon = styled(PresentationChartBarIcon)`
  width: 24px;
  height: 24px;
`;
const StyledTeamStatsIcon = styled(PresentationChartLineIcon)`
  width: 24px;
  height: 24px;
`;
const NavLinks = styled('div')`
`;
const Link = styled.a<LeftBarProps>`
  height: 40px;
  display: flex;
  gap: 10px;
  align-items: center;
  padding-left: ${(props) => (props.$expanded ? "16px" : "0")};
  justify-content: ${(props) => (props.$expanded ? "flex-start" : "center")};
  font-size: 14px;
  margin: 8px 12px;
  border-radius: 4px;
  color: var(--color-text-primary);

  &:hover {
    background-color: #20286B;
    color: #fff;
    cursor: pointer;
  }
`;
const HideSideMenuButton = styled('button')`
display: flex;
font-size: 14px;
white-space: nowrap;
align-items: center;
padding: 2px 14px;
background-color: transparent;
color: var(--color-text-primary);

&:hover {
  border-color: var(--color-text-primary);
}
`;
const NavFooter = styled('div')`
display: flex;
padding: 16px;
`;