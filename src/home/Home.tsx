import NavMenu from "../navigation/NavMenu";
import styled from "styled-components";
import { useRef, useState } from "react";
import LoginModal from "./LoginModal";
import { Route, Routes } from "react-router-dom";
import Games from "../components/Games/Games";
import PlayerTable from "../components/PlayerTable";
import TeamTable from "../components/TeamTable";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import News from "../components/News/News";

const Home = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [popupPosition, setPopupPosition] = useState(0);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const togglePopup = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPopupPosition(rect.bottom + window.scrollY);
      console.log(popupPosition);
    }
    setShowLoginModal(!showLoginModal);
  };

  return (
    <Container>
      <NavMenu />
      <PageContainer>
        <Header>
          <h3>Hello, tortuga!</h3>
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
              <Route path="/" element={<News />} />
              <Route path="/games" element={<Games />} />
              <Route path="/players" element={<PlayerTable />} />
              <Route path="/teams" element={<TeamTable />} />
              <Route path="/my-team" element={<div />} />
              <Route path="/manage-cup" element={<div />} />
              <Route path="/admin" element={<div />} />
            </Routes>
          </Content>
        </Row>
      </PageContainer>
    </Container>
  );
};
export default Home;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;
const PageContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: var(--color-background-secondary-darker);
  margin: 16px;
  border-radius: 16px;
`;
const Row = styled.div`
  height: 100%;
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
  gap: 8px;
  padding: 24px;
  justify-content: flex-end;
  align-items: center;
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
    border-color: #E0E0E0;
  }

  &:active {
    border-color: #E0E0E0;
  }
`;
const HamburgerMenuIcon = styled(UserCircleIcon)`
  color: #E0E0E0;
  width: 28px;
  height: 28px; 
`;
