import NavMenu from "../navigation/NavMenu";
import styled from "styled-components";
import { Bars2Icon } from "@heroicons/react/16/solid";
import { TrophyIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import LoginModal from "./LoginModal";
import PlayerTable from "../PlayerTable";
import TeamTable from "../TeamTable";
import { Route, Routes } from "react-router-dom";
import Games from "../Games/Games";

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
      <Header>
        <h2 style={{ width: "70%" }}>
          <StyledTrophyIcon />
          Cup Manager
        </h2>
        <IconButton ref={buttonRef} onClick={() => togglePopup()}>
          <StyledBars2Icon />
          {showLoginModal && (
            <LoginModal
              popupPosition={popupPosition}
              showLoginModal={setShowLoginModal}
            />
          )}
        </IconButton>
      </Header>
      <Row>
        <NavMenu />
        <Content>
          <Routes>
            <Route path="/" element={<div>hej</div>} />
            <Route path="/games" element={<Games />} />
            <Route path="/players" element={<PlayerTable />} />
            <Route path="/teams" element={<TeamTable />} />
            <Route path="/my-team" element={<div />} />
            <Route path="/manage-cup" element={<div />} />
            <Route path="/admin" element={<div />} />
          </Routes>
        </Content>
      </Row>
    </Container>
  );
};
export default Home;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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
  width: 100%;
  border-bottom: 1px solid #007bff;
  display: flex;
  padding-top: 10px;
  padding-bottom: 10px;
`;
const StyledTrophyIcon = styled(TrophyIcon)`
  width: 24px;
  height: 24px;
  margin: auto;
  margin-left: 5%;
  margin-right: 5%;
`;
const IconButton = styled.button`
  height: 50%;
  margin: auto;
  margin-right: 5%;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;
const StyledBars2Icon = styled(Bars2Icon)`
  color: #ffffff; /* White */
  width: 24px; /* Set a width */
  height: 24px; /* Set a height */
`;
