import { styled } from "styled-components";
import { Player } from "../../utils/types/Player";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface PlayerProfileProps {
  player: Player;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlayerProfile = ({ player, setShowModal }: PlayerProfileProps) => {
  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={() => setShowModal(false)} />
        {player.position === "G" ? (
          <Container>
            <h2>{player.name}</h2>
            <StatRow>Number: {player.jerseyNumber}</StatRow>
            <StatRow>Position: {player.position}</StatRow>
            <StatRow>Games played: {player.gamesPlayed}</StatRow>
            <StatRow>Wins: {player.wins}</StatRow>
            <StatRow>Save percentage: {player.savePercent}</StatRow>
            <StatRow>
              Goals against average:{" "}
              {player.goalsAgainst
                ? player.goalsAgainst / player.gamesPlayed
                : 0}
            </StatRow>
          </Container>
        ) : (
          <Container>
            <h2>{player.name}</h2>
            <StatRow>Number: {player.jerseyNumber}</StatRow>
            <StatRow>Position: {player.position}</StatRow>
            <StatRow>Games played: {player.gamesPlayed}</StatRow>
            <StatRow>Goals: {player.goals}</StatRow>
            <StatRow>Assists: {player.assists}</StatRow>
            <StatRow>Penalty minutes: {player.penaltyMinutes}</StatRow>
          </Container>
        )}
      </Modal>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CloseIcon = styled(XMarkIcon)`
  height: 38px;
  margin: auto;
  margin-right: 0;
`;
const StatRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 24px;
`;

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
  @media (max-width: 768px) {
    opacity: 100%;
  }
`;
const Modal = styled.div`
  top: 5%;
  left: 10%;
  width: 80%;
  z-index: 100;
  position: absolute;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--neutral-surface-contrast);
  @media (max-width: 768px) {
    top: 10%;
    left: 0;
    width: 90%;
  }
`;
