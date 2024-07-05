import NavMenu from "../navigation/NavMenu";
import styled from "styled-components";
import { useRef, useState } from "react";
import LoginModal from "./LoginModal";
import { Route, Routes } from "react-router-dom";
import Admin from "../Admin";
import Games from "../components/Games/Games";
import PlayerTable from "../components/PlayerTable";
import TeamTable from "../components/TeamTable";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import News from "../components/News/News";
import {
  ROUTE_PATH_ADMIN,
  ROUTE_PATH_BRACKET,
  ROUTE_PATH_GAMES,
  ROUTE_PATH_MANAGE_CUP,
  ROUTE_PATH_MY_TEAM,
  ROUTE_PATH_NEWS,
  ROUTE_PATH_PLAYERS,
  ROUTE_PATH_TEAMS,
} from "../constants/routes";
import { useUser } from "../utils/context/UserContext";
import Bracket from "../components/Bracket/Bracket";
import CompetitionPicker from "../components/CompetitionPicker";
import { useCompetition } from "../utils/context/CompetitionContext";
import SetCompetitionFromUrl from "../components/CompetitionPicker/SetCompetitionFromUrl";

const Home = () => {
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

  window.onscroll = function () { scrollFunction() };

  function scrollFunction() {
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
      setHasScrolled(true);
    }
  }

  return (
    <Container>
      {!competition && <CompetitionPicker />}
      <NavMenu />
      <PageContainer>
        <Header>
          <IconButton ref={buttonRef} onClick={() => togglePopup()}>
            <HamburgerMenuIcon />
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
                    <News hasScrolled={hasScrolled} />
                  </>
                }
              />
              <Route path={ROUTE_PATH_NEWS} element={<News hasScrolled={hasScrolled} />} />
              <Route path={ROUTE_PATH_GAMES} element={<Games />} />
              <Route
                path={ROUTE_PATH_PLAYERS}
                element={<PlayerTable small={false} />}
              />
              <Route
                path={ROUTE_PATH_TEAMS}
                element={<TeamTable small={false} />}
              />
              <Route path={ROUTE_PATH_BRACKET} element={<Bracket />} />
              <Route path={ROUTE_PATH_MY_TEAM} element={<div />} />
              <Route path={ROUTE_PATH_MANAGE_CUP} element={<div />} />
              {user && user.providerType !== "anon-user" && (
                <Route path={ROUTE_PATH_ADMIN} element={<Admin />} />
              )}
            </Routes>
          </Content>
        </Row>
      </PageContainer>
    </Container>
  );
};
export default Home;

const Container = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: 768px) {
    background-color: #f9f9f9;
  }
`;
const PageContainer = styled.div`
  width: 100%;
  background-color: #052029;
  border-radius: 16px;
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
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;
const IconButton = styled.button`
  background-color: transparent;
  border: 1px solid transparent;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;

  &:hover {
    border-color: #e0e0e0;
  }

  &:active {
    border-color: #e0e0e0;
  }
`;
const HamburgerMenuIcon = styled(UserCircleIcon)`
  color: white;
  width: 28px;
  height: 28px;
`;
