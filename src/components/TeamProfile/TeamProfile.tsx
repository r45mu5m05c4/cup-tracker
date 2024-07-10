import { styled } from "styled-components";
import { Team } from "../../utils/types/Team";
import { useEffect, useState } from "react";
import { getPlayerByTeam } from "../../utils/queries";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { useUser } from "../../utils/context/UserContext";
import { Player } from "../../utils/types/Player";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface TeamProfileProps {
  team: Team;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TeamProfile = ({ team, setShowModal }: TeamProfileProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const getPlayersInTeam = async () => {
      if (user?.accessToken && competition?.name)
        try {
          await refreshAccessToken();
          const playersFromAPI = await getPlayerByTeam(
            team.name,
            user.accessToken,
            competition.name
          );
          setPlayers(playersFromAPI);
        } catch (e) {
          console.log(e);
        }
    };
    getPlayersInTeam();
  }, []);
  const chunkArray = (array: Player[], chunkSize: number): Player[][] => {
    const results: Player[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };
  const rightWingers = players.filter((player) => player.position === "RW");
  const leftWingers = players.filter((player) => player.position === "LW");
  const centers = players.filter((player) => player.position === "C");
  const defenders = players.filter((player) => player.position === "D");
  const goalies = players.filter((player) => player.position === "G");
  const defenderChunks = chunkArray(defenders, 2);

  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseIcon onClick={() => setShowModal(false)} />
        <Container>
          <h2>{team.name}</h2>
          <img
            src={team.logo}
            alt=""
            style={{ width: "54px", height: "54px" }}
          />
          <ForwardRow>
            <ForwardColumn>
              <h3>LW</h3>
              {leftWingers.length > 0 &&
                leftWingers.map((forward, index) => (
                  <PlayerCard key={index}>
                    #{forward.jerseyNumber} {forward.name}
                  </PlayerCard>
                ))}
            </ForwardColumn>
            <ForwardColumn>
              <h3>C</h3>
              {centers.length > 0 &&
                centers.map((forward, index) => (
                  <PlayerCard key={index}>
                    #{forward.jerseyNumber} {forward.name}
                  </PlayerCard>
                ))}
            </ForwardColumn>
            <ForwardColumn>
              <h3>RW</h3>
              {rightWingers.length > 0 &&
                rightWingers.map((forward, index) => (
                  <PlayerCard key={index}>
                    #{forward.jerseyNumber} {forward.name}
                  </PlayerCard>
                ))}
            </ForwardColumn>
          </ForwardRow>
          <h3>D</h3>
          {defenderChunks.map((chunk, rowIndex) => (
            <DefenderRow key={rowIndex}>
              {chunk.map((defender, index) => (
                <PlayerCard key={index}>
                  #{defender.jerseyNumber} {defender.name}
                </PlayerCard>
              ))}
            </DefenderRow>
          ))}
          <h3>G</h3>
          {goalies.length > 0 && (
            <GoalieRow>
              {goalies.map((goalie, index) => (
                <PlayerCard key={index}>
                  #{goalie.jerseyNumber} {goalie.name}
                </PlayerCard>
              ))}
            </GoalieRow>
          )}
        </Container>
      </Modal>
    </>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: 768px) {
    font-size: 0.8em;
  }
`;
const CloseIcon = styled(XMarkIcon)`
  height: 38px;
  margin: auto;
  margin-right: 0;
`;
const ForwardRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin-bottom: 24px;
`;
const ForwardColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 33%;
  align-items: center;
`;

const DefenderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;
  margin-bottom: 24px;
`;

const GoalieRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: auto;
`;

const PlayerCard = styled.div`
  margin: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
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
