import styled from "styled-components";
import { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Admin from "./../Admin";
import PlayerTable from "../components/PlayerTable";
import TeamTable from "../components/TeamTable";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { useUser } from "../utils/context/UserContext";
import CompetitionPicker from "../components/CompetitionPicker";
import { useCompetition } from "../utils/context/CompetitionContext";
import { ROUTES } from "../constants/routes";
import { Start } from "../components/Start/Start";
import { DesktopMenu } from "../navigation/DesktopMenu";
import { LoginModal } from "../components/Login/LoginModal";
import { SetCompetitionFromUrl } from "../components/CompetitionPicker/SetCompetitionFromUrl";
import { Bracket } from "../components/Bracket/Bracket";
import { Games } from "../components/Games/Games";
import { IconButton } from "../molecules/IconButton";

export const MainContainer = () => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<number>(0);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { competition } = useCompetition();
  const { user } = useUser();

  const togglePopup = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition(rect.bottom);
    }
    setShowLoginModal(!showLoginModal);
  };

  window.onscroll = function () {
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
      <Page>
        <Header>
          <IconButton
            ref={buttonRef}
            Icon={UserCircleIcon}
            onClick={togglePopup}
          />
          {showLoginModal && (
            <LoginModal
              popupPosition={popupPosition}
              showLoginModal={setShowLoginModal}
            />
          )}
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
      </Page>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
`;

const Page = styled.div`
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
