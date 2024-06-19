
import styled, { css } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import {
  NewspaperIcon,
  BoltIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Typography from "../molecules/Typography";
import { ROUTE_PATH_ADMIN, ROUTE_PATH_GAMES, ROUTE_PATH_NEWS, ROUTE_PATH_PLAYERS, ROUTE_PATH_TEAMS } from "../constants/routes";

interface NavLinksProps {
  collapsed: boolean;
}

const NavLinks = ({ collapsed }: NavLinksProps) => {
  const location = useLocation();

  const isTeamAdmin = false;
  const isCupAdmin = false;
  const isAdmin = true;

  const showAdminSection = isTeamAdmin || isCupAdmin || isAdmin;

  const isActive = (path: string) => {
    return location.pathname === path;
  }

  return (
    <Container>
      <StyledLink to={ROUTE_PATH_NEWS} $active={isActive(ROUTE_PATH_NEWS)} $collapsed={collapsed} >
        <StyledLinkIcon />
        {!collapsed && <Typography variant="p">News</Typography>}
      </StyledLink>
      <StyledLink to={ROUTE_PATH_GAMES} $active={isActive(ROUTE_PATH_GAMES)} $collapsed={collapsed}>
        <StyledGamesIcon />
        {!collapsed && <Typography variant="p">Games</Typography>}
      </StyledLink>
      <StyledLink to={ROUTE_PATH_PLAYERS} $active={isActive(ROUTE_PATH_PLAYERS)} $collapsed={collapsed}>
        <StyledPlayerStatsIcon />
        {!collapsed && <Typography variant="p">Player stats</Typography>}
      </StyledLink>
      <StyledLink to={ROUTE_PATH_TEAMS} $active={isActive(ROUTE_PATH_TEAMS)} $collapsed={collapsed}>
        <StyledTeamStatsIcon />
        {!collapsed && <Typography variant="p">Team stats</Typography>}
      </StyledLink>
      {showAdminSection && (
        <>
          <Separator />
          {isTeamAdmin && (
            <StyledLink to={ROUTE_PATH_ADMIN} $active={isActive(ROUTE_PATH_ADMIN)} $collapsed={collapsed}>
              {!collapsed && <Typography variant="p">My team</Typography>}
            </StyledLink>
          )}
          {isCupAdmin && (
            <StyledLink to={ROUTE_PATH_ADMIN} $active={isActive(ROUTE_PATH_ADMIN)} $collapsed={collapsed}>
              {!collapsed && <Typography variant="p">Manage cup</Typography>}
            </StyledLink>
          )}
          {isAdmin && (
            <StyledLink to={ROUTE_PATH_ADMIN} $active={isActive(ROUTE_PATH_ADMIN)} $collapsed={collapsed}>
              <StyledSuperAdminIcon />
              {!collapsed && <Typography variant="p">Super admin tools</Typography>}
            </StyledLink>
          )}
          <Separator />
        </>
      )}
    </Container>
  );
};

export default NavLinks;


const Container = styled("div")`
  flex: 1;
  margin-top: 6px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  white-space: nowrap;
`;
const StyledLinkIcon = styled(NewspaperIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;
const StyledGamesIcon = styled(BoltIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;
const StyledPlayerStatsIcon = styled(PresentationChartBarIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;
const StyledTeamStatsIcon = styled(PresentationChartLineIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;
const StyledSuperAdminIcon = styled(WrenchScrewdriverIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledLink = styled(Link) < { $active: boolean, $collapsed: boolean } > `
  height: 38px;
  display: flex;
  gap: 10px;
  padding: ${(props) => (props.$collapsed ? "0 8px" : "0 0 0 8px")};
  align-items: center;
  font-size: 14px;
  margin: 8px 12px;
  border-radius: 4px;
  font-weight: 600;      
  background-color: ${(props) => (props.$active ? "#42917E" : "transparent")};
  color: ${(props) => (props.$active ? "#fff" : "var(--color-text-primary)")};

  &:hover {
    background-color: ${(props) => (!props.$active ? "#07333F" : "42917E")};
    color: #fff;
    cursor: pointer;
  }

  ${props =>
    props.$active &&
    css`
        background-color: #42917E;
        color: #fff;
    `}
`;

const Separator = styled('div')`
  background-color: var(--color-divider-primary);
  margin: 24px 14px;
  height: 1px;
`;
