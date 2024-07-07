import { styled } from "styled-components";

import { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { addPlayer, getTeams } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { PlayerPosition } from "../utils/types/Player";
import { useCompetition } from "../utils/context/CompetitionContext";

export type NewPlayer = {
  generatedId: string;
  name: string;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  gamesPlayed: number;
  position: PlayerPosition;
  jerseyNumber: number;
  teamName: string;
  competition: string;
};

export const AddPlayer = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [jerseyNumber, setJerseyNumber] = useState<number>(0);
  const [position, setPosition] = useState<PlayerPosition>(
    PlayerPosition.Center
  );
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
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

  const handleTeamSelect = (teamId: string) => {
    const foundTeam = teams.find((team) => team._id === teamId);
    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
  };

  const handleAddPlayer = async () => {
    if (user?.accessToken && competition) {
      if (selectedTeam && position) {
        const newPlayer: NewPlayer = {
          generatedId: `${playerName}${jerseyNumber}${selectedTeam.name}`,
          name: playerName,
          goals: 0,
          assists: 0,
          points: 0,
          penaltyMinutes: 0,
          gamesPlayed: 0,
          position: position,
          jerseyNumber: jerseyNumber,
          teamName: selectedTeam.name,
          competition: competition.name,
        };
        console.log(newPlayer);
        try {
          await refreshAccessToken();
          await addPlayer(newPlayer, user?.accessToken);
          setMessage(`Successfully added ${newPlayer.name}`);
        } catch (e) {
          console.log(e);
          setMessage("Could not update player");
        }
      }
    }
  };
  const possiblePlayerPositions: PlayerPosition[] = [
    PlayerPosition.Center,
    PlayerPosition.Defense,
    PlayerPosition.Goalie,
    PlayerPosition.LeftWing,
    PlayerPosition.RightWing,
  ];
  return (
    <Container>
      <h2>Admin Page - Add Player</h2>
      <Select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team to add a player to</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </Select>
      {selectedTeam && (
        <div>
          <h3>Add player to: {selectedTeam.name}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPlayer();
            }}
          >
            <Label>
              Name:
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </Label>
            <Label>
              Jersey Number:
              <input
                type="number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
              />
            </Label>
            <Label>
              Position:
              <Select
                value={position}
                onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              >
                {possiblePlayerPositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </Select>
            </Label>
            <Button type="submit">Add Player</Button>
          </form>
        </div>
      )}
      {message !== "" && <span>{message}</span>}
    </Container>
  );
};

const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 60%;
  display: flex;
  flex-direction: column;
`;
const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: grey;
  color: var(--text-base);
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 24px;
  &:disabled {
    background-color: var(--text-muted);
    cursor: default;
    &:hover {
      border: 1px solid transparent;
    }
  }
`;
const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 5px;
  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
const Select = styled.select`
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: auto;
  margin-right: 0;
  width: 70%;
  padding: 8px;
  @media (max-width: 768px) {
    font-size: 0.8em;
    width: 100%;
  }
`;
