import { styled } from "styled-components";

import { useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { getPlayerByTeam, getTeams } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Player, PlayerPosition } from "../../utils/types/Player";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { UpdatePlayerModal } from "./UpdatePlayerModal";
import { Typography } from "../../molecules/Typography";
import { Select } from "../../molecules/Select";

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

export const UpdatePlayers = () => {
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player>();
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
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
        await refreshAccessToken();
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

  const editPlayer = (p: Player) => {
    setSelectedPlayer(p);
    setShowModal(true);
  };

  return (
    <Container>
      <Select
        label="Teams"
        placeholder="Select team"
        options={teams.map((team) => ({
          value: team._id,
          label: team.name,
        }))}
        onChange={(e) => handleTeamSelect(e.target.value)}
      />
      {players && players.length > 0 ? (
        players?.map((p: Player) => (
          <PlayerCard key={p._id} onClick={() => editPlayer(p)}>
            <PlayerCell>{p.name}</PlayerCell>
            <PlayerCell>{p.jerseyNumber}</PlayerCell>
            <PlayerCell>{p.position}</PlayerCell>
          </PlayerCard>
        ))
      ) : (
        <Typography style={{ marginTop: "24px" }}>
          {players === null ? "" : "No players yet."}
        </Typography>
      )}
      {showModal && selectedPlayer && (
        <UpdatePlayerModal
          player={selectedPlayer}
          setShowModal={setShowModal}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const PlayerCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  cursor: pointer;
  border: 1px solid;
  margin-top: 5px;
`;

const PlayerCell = styled.p`
  margin: auto;
  margin-left: 10px;
`;
