import { styled } from "styled-components";

import { useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { getPlayerByTeam, getTeams } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Player } from "../../utils/types/Player";
import RemovePlayerModal from "./RemovePlayerModal";
import { useCompetition } from "../../utils/context/CompetitionContext";

const RemovePlayer = () => {
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const { user } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken && competition)
        try {
          const teamsFromAPI = await getTeams(
            user.accessToken,
            competition.name
          );
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllTeams();
  }, []);

  const handleTeamSelect = async (teamId: string) => {
    const foundTeam = teams.find((team) => team._id === teamId);
    if (foundTeam && user?.accessToken) {
      try {
        const playersInTeam = await getPlayerByTeam(
          foundTeam.name,
          user.accessToken,
          foundTeam.competition
        );
        setPlayers(playersInTeam);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
  };

  const removePlayer = (p: Player) => {
    setSelectedPlayer(p);
    setShowModal(true);
  };

  return (
    <Container>
      <h2>Admin Page - Remove Players</h2>
      <Select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </Select>
      {players.length
        ? players.map((p: Player) => (
            <PlayerCard key={p._id} onClick={() => removePlayer(p)}>
              <PlayerCell>{p.name}</PlayerCell>
              <PlayerCell>{p.jerseyNumber}</PlayerCell>
              <PlayerCell>{p.position}</PlayerCell>
            </PlayerCard>
          ))
        : "No players in team"}
      {selectedPlayer && showModal && (
        <RemovePlayerModal
          player={selectedPlayer}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  );
};

export default RemovePlayer;

const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const PlayerCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  cursor: pointer;
  border: 1px solid;
  margin-top: 5px;
  padding: 10px;
  width: 80%;
`;
const PlayerCell = styled.p`
  margin: auto;
  margin-left: 10px;
  width: 33%;
`;

const Select = styled.select`
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  width: 80%;
  padding: 8px;
  @media (max-width: 768px) {
    font-size: 0.8em;
    width: 100%;
  }
`;
