import { styled } from "styled-components";

import React, { useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import {  getPlayerByTeam, getTeams } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Player, PlayerPosition } from "../../utils/types/Player";
import UpdatePlayerModal from "./UpdatePlayerModal";

export type NewPlayer = {
  name: string;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  gamesPlayed: number;
  position: PlayerPosition;
  jerseyNumber: number;
  teamName: string;
};

const UpdatePlayers: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const { user } = useUser();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user.accessToken);
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
            user.accessToken
          );
          setPlayers(playersInTeam);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    }
  };

  const editPlayer = (p: Player) => {
    setSelectedPlayer(p);
    setShowModal(true);
  };

  return (
    <Container>
      <h2>Admin Page - Update Players</h2>
      <select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team update</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>
      {players.length &&
        players.map((p: Player) => (
          <PlayerCard key={p._id} onClick={() => editPlayer(p)}>
            <PlayerCell>{p.name}</PlayerCell>
            <PlayerCell>{p.jerseyNumber}</PlayerCell>
            <PlayerCell>{p.position}</PlayerCell>
          </PlayerCard>
        ))}
      {showModal && selectedPlayer && (
        <UpdatePlayerModal
          player={selectedPlayer}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  );
};

export default UpdatePlayers;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
const PlayerCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  cursor: pointer;
  border: 1px solid;
  margin-top: 5px;
  padding: 10px;
`;
const PlayerCell = styled.p`
  margin: auto;
  margin-left: 10px;
`;
