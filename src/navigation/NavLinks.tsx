import styled, { css } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../utils/context/UserContext";
import { useCompetition } from "../utils/context/CompetitionContext";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  HomeIcon,
  PaperAirplaneIcon,
  PresentationChartLineIcon,
  TrophyIcon,
} from "@heroicons/react/20/solid";
import { ROUTES } from "../constants/routes";
import { Typography } from "../molecules/Typography";

interface NavLinksProps {
  collapsed: boolean;
}

export const NavLinks = ({ collapsed }: NavLinksProps) => {
  const location = useLocation();
  const { user } = useUser();
  const { competition, setCompetition } = useCompetition();

  const isTeamAdmin = false;
  const isCupAdmin = false;
  const isAdmin = user && user.providerType !== "anon-user";

  const showAdminSection = isTeamAdmin || isCupAdmin || isAdmin;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Container>
      <StyledLink
        to={ROUTES.START}
        $active={isActive(ROUTES.START)}
        $collapsed={collapsed}
      >
        <StyledLinkIcon />
        {!collapsed && <Typography>Start</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTES.GAMES}
        $active={isActive(ROUTES.GAMES)}
        $collapsed={collapsed}
      >
        <StyledGamesIcon />
        {!collapsed && <Typography>Games</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTES.PLAYERS}
        $active={isActive(ROUTES.PLAYERS)}
        $collapsed={collapsed}
      >
        <StyledPlayerStatsIcon />
        {!collapsed && <Typography>Player stats</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTES.TEAMS}
        $active={isActive(ROUTES.TEAMS)}
        $collapsed={collapsed}
      >
        <StyledTeamStatsIcon />
        {!collapsed && <Typography>Standings</Typography>}
      </StyledLink>
      {competition?.type === "cup" && (
        <StyledLink
          to={ROUTES.BRACKET}
          $active={isActive(ROUTES.BRACKET)}
          $collapsed={collapsed}
        >
          <StyledPlayoffBracketIcon />
          {!collapsed && <Typography>Playoff bracket</Typography>}
        </StyledLink>
      )}
      {showAdminSection && (
        <>
          <Separator />
          {isTeamAdmin && (
            <StyledLink
              to={ROUTES.ADMIN}
              $active={isActive(ROUTES.ADMIN)}
              $collapsed={collapsed}
            >
              {!collapsed && <Typography>My team</Typography>}
            </StyledLink>
          )}
          {isCupAdmin && (
            <StyledLink
              to={ROUTES.ADMIN}
              $active={isActive(ROUTES.ADMIN)}
              $collapsed={collapsed}
            >
              {!collapsed && <Typography>Manage cup</Typography>}
            </StyledLink>
          )}
          {isAdmin && (
            <StyledLink
              to={ROUTES.ADMIN}
              $active={isActive(ROUTES.ADMIN)}
              $collapsed={collapsed}
            >
              <StyledSuperAdminIcon />
              {!collapsed && <Typography>Super admin tools</Typography>}
            </StyledLink>
          )}
        </>
      )}
      <Separator />
      <StyledLink
        to="/"
        $active={false}
        $collapsed={collapsed}
        onClick={() => setCompetition(null)}
      >
        <StyledSuperAdminIcon />
        {!collapsed && <Typography>Change competition</Typography>}
      </StyledLink>
    </Container>
  );
};

const Container = styled("div")`
  flex: 1;
  margin-top: 6px;
  margin-right: auto;
  margin-left: auto;
  width: 100%;
  white-space: nowrap;
`;

const StyledLinkIcon = styled(HomeIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledGamesIcon = styled(PaperAirplaneIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledPlayerStatsIcon = styled(ChartBarSquareIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledTeamStatsIcon = styled(PresentationChartLineIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledSuperAdminIcon = styled(Cog6ToothIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledPlayoffBracketIcon = styled(TrophyIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledLink = styled(Link)<{ $active: boolean; $collapsed: boolean }>`
  height: 38px;
  display: flex;
  gap: 12px;
  padding: ${(props) => (props.$collapsed ? "0 8px" : "0 0 0 8px")};
  align-items: center;
  font-size: 14px;
  margin: 12px;
  border-radius: 4px;
  font-weight: 600;
  background-color: ${(props) =>
    props.$active ? "var(--decorative-brand-light)" : "transparent"};
  color: ${(props) =>
    props.$active ? "var(--text-base)" : "var(--text-muted)"};

  &:hover {
    background-color: ${(props) =>
      !props.$active
        ? "var(--neutral-surface-muted)"
        : "var(--decorative-brand-light)"};
    color: var(--text-base);
    cursor: pointer;
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--decorative-brand-light);
      color: var(--text-base);
    `}
`;

const Separator = styled("div")`
  background-color: var(--neutral-border-onBase);
  margin: 24px 14px;
  height: 1px;
`;
