import styled from "styled-components";
import { FC, useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import { Game } from "../../utils/types/Game";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  game: Game;
}

const GameModal: FC<Props> = ({ setShowModal, game }) => {
  const { user } = useUser();
  const refresh = () => {
    console.log("HOLA");
  };
  return (
    <>
      <Modal onClick={(e) => e.stopPropagation()}>
        <LiveGame>
          <Header>
            {game.awayTeam} @ {game.homeTeam}
          </Header>
          <GoalsRow>
            <AwayGoals>0{game.awayTeamGoals.toString()}</AwayGoals>
            <HomeGoals>1{game.homeTeamGoals.toString()}</HomeGoals>
          </GoalsRow>
          <EventsRow home={true}>GOAL - #56 Evan Farbstein</EventsRow>
          <EventsRow home={false}>GOAL - #56 Evan Farbstein</EventsRow>
        </LiveGame>
        <Button onClick={() => setShowModal(false)}>Refresh</Button>
        <Button onClick={() => setShowModal(false)}>Close</Button>
      </Modal>
    </>
  );
};

export default GameModal;

const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 24px;
`;
const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
`;
const Modal = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 24px;
  margin-right: 100px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;
const LiveGame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
`;
const Header = styled.h2`
  margin: auto;
`;
const GoalsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
const HomeGoals = styled.h1`
  width: 50%;
  margin-right: 5%;
  margin-left: auto;
  text-align: right;
`;
const AwayGoals = styled.h1`
  width: 50%;
  margin-right: auto;
  margin-left: 5%;
`;
const EventsRow = styled.p<{ home: boolean }>`
  text-align: ${(props) => (props.home ? "right" : "left")};
  border-top: 1px solid;
  border-bottom: 1px solid;
`;
