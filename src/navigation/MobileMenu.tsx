import styled, { css } from "styled-components";
import { useUser } from "../utils/context/UserContext";
import { Link, useLocation } from "react-router-dom";
import {
  BoltIcon,
  PresentationChartBarIcon,
  PresentationChartLineIcon,
  WrenchScrewdriverIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { HomeIcon, UserGroupIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { useCompetition } from "../utils/context/CompetitionContext";
import { ROUTES } from "../constants/routes";
import { Typography } from "../molecules/Typography";

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const location = useLocation();
  const { user } = useUser();
  const { setCompetition } = useCompetition();

  const isTeamAdmin = false;
  const isCupAdmin = false;
  const isAdmin = user && user.providerType !== "anon-user";

  const showAdminSection = isTeamAdmin || isCupAdmin || isAdmin;

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <Overlay onClick={onClose} />
      <Menu>
        <CloseButton onClick={onClose}>
          <StyledCloseIcon />
        </CloseButton>
        <StyledLink
          to={ROUTES.START}
          $active={isActive(ROUTES.START)}
          onClick={onClose}
        >
          <StyledLinkIcon />
          {<Typography>Start</Typography>}
        </StyledLink>
        <StyledLink
          to={ROUTES.GAMES}
          $active={isActive(ROUTES.GAMES)}
          onClick={onClose}
        >
          <StyledGamesIcon />
          {<Typography>Games</Typography>}
        </StyledLink>
        <StyledLink
          to={ROUTES.PLAYERS}
          $active={isActive(ROUTES.PLAYERS)}
          onClick={onClose}
        >
          <StyledPlayerStatsIcon />
          {<Typography>Player stats</Typography>}
        </StyledLink>
        <StyledLink
          to={ROUTES.TEAMS}
          $active={isActive(ROUTES.TEAMS)}
          onClick={onClose}
        >
          <StyledTeamStatsIcon />
          {<Typography>Standings</Typography>}
        </StyledLink>
        <StyledLink
          to={ROUTES.ROSTERS}
          $active={isActive(ROUTES.ROSTERS)}
          onClick={onClose}
        >
          <StyledRostersIcon />
          {<Typography>Rosters</Typography>}
        </StyledLink>
        <StyledLink
          to={ROUTES.BRACKET}
          $active={isActive(ROUTES.BRACKET)}
          onClick={onClose}
        >
          <StyledPlayoffBracketIcon />
          {<Typography>Playoff bracket</Typography>}
        </StyledLink>
        {showAdminSection && (
          <>
            <Separator />
            {isTeamAdmin && (
              <StyledLink
                to={ROUTES.ADMIN}
                $active={isActive(ROUTES.ADMIN)}
                onClick={onClose}
              >
                {<Typography>My team</Typography>}
              </StyledLink>
            )}
            {isCupAdmin && (
              <StyledLink
                to={ROUTES.ADMIN}
                $active={isActive(ROUTES.ADMIN)}
                onClick={onClose}
              >
                {<Typography>Manage cup</Typography>}
              </StyledLink>
            )}
            {isAdmin && (
              <StyledLink
                to={ROUTES.ADMIN}
                $active={isActive(ROUTES.ADMIN)}
                onClick={onClose}
              >
                <StyledSuperAdminIcon />
                {<Typography>Super admin tools</Typography>}
              </StyledLink>
            )}
          </>
        )}
        <Separator />
        <StyledLink
          to="/"
          $active={false}
          onClick={() => {
            onClose();
            setCompetition(null);
          }}
        >
          <StyledSuperAdminIcon />
          {<Typography>Change competition</Typography>}
        </StyledLink>
      </Menu>
    </>
  );
};

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  overflow: auto;
  opacity: 30%;
  background-color: #000;
  z-index: 50;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  top: 0;
  bottom: 0;
  padding-top: 62px;
  padding-bottom: 62px;
  position: fixed;
  overflow: auto;
  background-color: var(--neutral-surface-navMenu);
  z-index: 150;
  border-top-right-radius: 30px;
  width: 85%;
  animation: 0.6s expand;
  p {
    font-size: 1.2em;
  }

  @keyframes expand {
    0% {
      width: 0%;
    }
    100% {
      width: 85%;
    }
  }
`;

const StyledLink = styled(Link)<{ $active: boolean }>`
  height: 38px;
  display: flex;
  gap: 14px;
  padding: 8px;
  align-items: center;
  font-size: 14px;
  margin: 8px 12px;
  border-radius: 4px;
  font-weight: 600;
  background-color: ${(props) =>
    props.$active ? "var(--decorative-brand-light)" : "transparent"};
  color: ${(props) => (props.$active ? "#fff" : "var(--text-muted)")};
  white-space: nowrap;

  &:hover {
    background-color: ${(props) =>
      !props.$active ? "#07333F" : "var(--decorative-brand-light)"};
    color: #fff;
    cursor: pointer;
  }

  ${(props) =>
    props.$active &&
    css`
      background-color: var(--decorative-brand-light);
      color: #fff;
    `}
`;

const StyledLinkIcon = styled(HomeIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledGamesIcon = styled(BoltIcon)`
  width: 20px;
  min-width: 20px;
  height: 20px;
`;

const StyledRostersIcon = styled(UserGroupIcon)`
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

const CloseButton = styled.button`
  background-color: transparent;
  height: 46px;
  top: 10px;
  border: none;
  border-radius: 8px;
  position: fixed;
  z-index: 160;
  margin-left: 6px;

  &:focus {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const StyledCloseIcon = styled(XMarkIcon)`
  height: 34px;
  width: 34px;
  min-width: 24px;
  color: #e5e5e5;

  &:hover {
    cursor: pointer;
  }
`;

const Separator = styled("div")`
  background-color: var(--neutral-border-onBase);
  margin: 24px 14px;
  height: 1px;
`;
