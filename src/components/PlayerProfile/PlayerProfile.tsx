import { styled } from "styled-components";
import { PlayerMetaData } from "../../utils/types/Player";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface PlayerProfileProps {
  player: PlayerMetaData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlayerProfile = ({ player, setShowModal }: PlayerProfileProps) => {
  const getFullPosition = (pos: string) => {
    switch (pos) {
      case "C":
        return "Center";
      case "LW":
        return "Left Wing";
      case "RW":
        return "Right Wing";
      case "D":
        return "Defenseman";
      case "G":
        return "Goaltender";
      default:
        return "Unknown";
    }
  };
  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseIcon
          style={{ cursor: "pointer" }}
          onClick={() => setShowModal(false)}
        />
        {player.position === "G" ? (
          <Container>
            <SubColumn>
              <h2>{player.name}</h2>{" "}
              <img
                src={player.team.logo}
                alt=""
                style={{ width: "54px", height: "54px" }}
              />
              <StatRow>
                <h3>
                  #{player.jerseyNumber}, {getFullPosition(player.position)}
                </h3>
              </StatRow>
            </SubColumn>
            <Divider />
            <StatColumn>
              <StatRow>Games played: {player.gamesPlayed}</StatRow>
              <StatRow>Wins: {player.wins}</StatRow>
              <StatRow>Save percentage: {player.savePercent}</StatRow>
              <StatRow>
                Goals against average:{" "}
                {player.goalsAgainst
                  ? player.goalsAgainst / player.gamesPlayed
                  : 0}
              </StatRow>
            </StatColumn>
          </Container>
        ) : (
          <Container>
            <SubColumn>
              <h2>{player.name}</h2>{" "}
              <img
                src={player.team.logo}
                alt=""
                style={{ width: "54px", height: "54px" }}
              />
              <StatRow>
                <h3>
                  #{player.jerseyNumber}, {getFullPosition(player.position)}
                </h3>
              </StatRow>
            </SubColumn>
            <Divider />
            <StatColumn>
              <StatRow>Games played: {player.gamesPlayed}</StatRow>
              <StatRow>Goals: {player.goals.length}</StatRow>
              <StatRow>
                Assists:
                {player.assists.length + player.secondaryAssists.length}
              </StatRow>
              <StatRow>Penalty minutes: {player.penalties.length}</StatRow>
            </StatColumn>
          </Container>
        )}
      </Modal>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Divider = styled.div`
  @media (max-width: 768px) {
    margin-bottom: 24px;
    height: 2px;
    width: 80%;
  }
  height: 250px;
  width: 2px;
  background-color: #fff;
  margin-right: 20px;
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
const SubColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  align-items: center;
  margin: auto;
`;
const StatColumn = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  margin: auto;
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
  width: 50%;
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
