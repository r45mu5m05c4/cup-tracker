import { FC } from "react";
import styled, { css } from "styled-components";
import Typography from "../molecules/Typography";
import {
  ROUTE_PATH_ADMIN,
  ROUTE_PATH_BRACKET,
  ROUTE_PATH_GAMES,
  ROUTE_PATH_NEWS,
  ROUTE_PATH_PLAYERS,
  ROUTE_PATH_TEAMS,
} from "../constants/routes";
import { useUser } from "../utils/context/UserContext";
import { Link, useLocation } from "react-router-dom";
import {
  NewspaperIcon,
  BoltIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

interface Props {
  isOpenProp: React.Dispatch<React.SetStateAction<boolean>>;
}

const HamburgerMenu: FC<Props> = ({ isOpenProp }) => {
  const location = useLocation();
  const { user } = useUser();
  const isTeamAdmin = false;
  const isCupAdmin = false;
  const isAdmin = user && user.providerType !== "anon-user";

  const showAdminSection = isTeamAdmin || isCupAdmin || isAdmin;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Menu>
      <StyledLink
        to={ROUTE_PATH_NEWS}
        $active={isActive(ROUTE_PATH_NEWS)}
        onClick={() => isOpenProp(false)}
      >
        <StyledLinkIcon />
        {<Typography variant="p">News</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTE_PATH_GAMES}
        $active={isActive(ROUTE_PATH_GAMES)}
        onClick={() => isOpenProp(false)}
      >
        <StyledGamesIcon />
        {<Typography variant="p">Games</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTE_PATH_PLAYERS}
        $active={isActive(ROUTE_PATH_PLAYERS)}
        onClick={() => isOpenProp(false)}
      >
        <StyledPlayerStatsIcon />
        {<Typography variant="p">Player stats</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTE_PATH_TEAMS}
        $active={isActive(ROUTE_PATH_TEAMS)}
        onClick={() => isOpenProp(false)}
      >
        <StyledTeamStatsIcon />
        {<Typography variant="p">Standings</Typography>}
      </StyledLink>
      <StyledLink
        to={ROUTE_PATH_BRACKET}
        $active={isActive(ROUTE_PATH_BRACKET)}
        onClick={() => isOpenProp(false)}
      >
        <StyledPlayoffBracketIcon />
        {<Typography variant="p">Playoff bracket</Typography>}
      </StyledLink>
      {showAdminSection && (
        <>
          {isTeamAdmin && (
            <StyledLink
              to={ROUTE_PATH_ADMIN}
              $active={isActive(ROUTE_PATH_ADMIN)}
              onClick={() => isOpenProp(false)}
            >
              {<Typography variant="p">My team</Typography>}
            </StyledLink>
          )}
          {isCupAdmin && (
            <StyledLink
              to={ROUTE_PATH_ADMIN}
              $active={isActive(ROUTE_PATH_ADMIN)}
              onClick={() => isOpenProp(false)}
            >
              {<Typography variant="p">Manage cup</Typography>}
            </StyledLink>
          )}
          {isAdmin && (
            <StyledLink
              to={ROUTE_PATH_ADMIN}
              $active={isActive(ROUTE_PATH_ADMIN)}
              onClick={() => isOpenProp(false)}
            >
              <StyledSuperAdminIcon />
              {<Typography variant="p">Super admin tools</Typography>}
            </StyledLink>
          )}
        </>
      )}
    </Menu>
  );
};

export default HamburgerMenu;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  top: 0;
  padding-top:54px;
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #000;
  z-index: 150;
`;
const StyledLink = styled(Link)<{ $active: boolean }>`
  height: 38px;
  display: flex;
  gap: 10px;
  padding: 8px;
  align-items: center;
  font-size: 14px;
  margin: 8px 12px;
  border-radius: 4px;
  font-weight: 600;
  background-color: ${(props) => (props.$active ? "#42917E" : "#000")};
  color: ${(props) => (props.$active ? "#fff" : "var(--color-text-primary)")};

  &:hover {
    background-color: ${(props) => (!props.$active ? "#07333F" : "42917E")};
    color: #fff;
    cursor: pointer;
  }

  ${(props) =>
    props.$active &&
    css`
      background-color: #42917e;
      color: #fff;
    `}
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
const StyledPlayoffBracketIcon = styled(TrophyIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;
