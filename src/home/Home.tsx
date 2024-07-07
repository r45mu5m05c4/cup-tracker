import styled from "styled-components";
import { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "../Admin";
import PlayerTable from "../components/PlayerTable";
import TeamTable from "../components/TeamTable";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { useUser } from "../utils/context/UserContext";
import CompetitionPicker from "../components/CompetitionPicker";
import { useCompetition } from "../utils/context/CompetitionContext";
import { ROUTES } from "../constants/routes";
import { Start } from "../components/Start/Start";
import { DesktopMenu } from "../navigation/DesktopMenu";
import { LoginModal } from "./LoginModal";
import { SetCompetitionFromUrl } from "../components/CompetitionPicker/SetCompetitionFromUrl";
import { Bracket } from "../components/Bracket/Bracket";
import { Games } from "../components/Games/Games";

export const Home = () => {
  const { competition } = useCompetition();
  const { user } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [popupPosition, setPopupPosition] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const togglePopup = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition(rect.bottom + window.scrollY);
    }
    setShowLoginModal(!showLoginModal);
  };

  window.onscroll = function () {
    scrollFunction();
  };

  const scrollFunction = () => {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      setHasScrolled(true);
    }
  };

  return (
    <Container
      className={
        competition?.name !== "Folkets cup" ? "red-theme" : "green-theme"
      }
    >
      {!competition && <CompetitionPicker />}
      <DesktopMenu />
      <PageContainer>
        <Header>
          <IconButton ref={buttonRef} onClick={() => togglePopup()}>
            <LoginIcon />
            {showLoginModal && (
              <LoginModal
                popupPosition={popupPosition}
                showLoginModal={setShowLoginModal}
              />
            )}
          </IconButton>
        </Header>
        <Row>
          <Content>
            <Routes>
              <Route
                path="/:competitionName/*"
                element={
                  <>
                    <SetCompetitionFromUrl />
                    <Start hasScrolled={hasScrolled} />
                  </>
                }
              />
              <Route
                path={ROUTES.START}
                element={<Start hasScrolled={hasScrolled} />}
              />
              <Route path={ROUTES.GAMES} element={<Games />} />
              <Route
                path={ROUTES.PLAYERS}
                element={<PlayerTable small={false} />}
              />
              <Route
                path={ROUTES.TEAMS}
                element={<TeamTable small={false} />}
              />
              <Route path={ROUTES.BRACKET} element={<Bracket />} />
              <Route path={ROUTES.MY_TEAM} element={<div />} />
              <Route path={ROUTES.MANAGE_CUP} element={<div />} />
              {user && user.providerType !== "anon-user" && (
                <Route path={ROUTES.ADMIN} element={<Admin />} />
              )}
            </Routes>
          </Content>
        </Row>
      </PageContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const PageContainer = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 14px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;

  &:active {
    border-color: var(--neutral-border-base);
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid white;
  }
`;

const LoginIcon = styled(UserCircleIcon)`
  color: var(--text-base);
  width: 38px;
  min-width: 38px;
  height: 38px;

  &:hover {
    color: var(--decorative-brand-light);
  }
`;
