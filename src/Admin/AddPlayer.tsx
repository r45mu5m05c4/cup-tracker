import { styled } from "styled-components";

import { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { addPlayer, getTeams } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { PlayerPosition } from "../utils/types/Player";
import { useCompetition } from "../utils/context/CompetitionContext";
import { Typography } from "../molecules/Typography";
import { Button } from "../molecules/Button";
import { Select } from "../molecules/Select";

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
  wins?: number;
  saves?: number;
  goalsAgainst?: number;
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
        const newPlayer: NewPlayer =
          position === "G"
            ? {
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
                wins: 0,
                saves: 0,
                goalsAgainst: 0,
              }
            : {
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
      <Select
        label="Select a team to add a player to"
        placeholder="Select a team"
        options={teams.map((team) => ({
          value: team._id,
          label: team.name,
        }))}
        onChange={(e) => handleTeamSelect(e.target.value)}
      />
      {selectedTeam && (
        <div>
          <Typography style={{ fontWeight: "600", marginTop: "12px" }}>
            Add player to: {selectedTeam.name}{" "}
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPlayer();
            }}
          >
            <Label>
              Name
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </Label>
            <Label>
              Jersey Number
              <input
                type="number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
              />
            </Label>

            <Select
              label="Position"
              value={position}
              placeholder="Select position"
              options={possiblePlayerPositions.map((position) => ({
                value: position,
                label: position,
              }))}
              onChange={(e) => setPosition(e.target.value as PlayerPosition)}
            />

            <div style={{ marginTop: "24px" }}>
              <Button type="submit" onClick={() => {}}>
                Add Player
              </Button>
            </div>
          </form>
        </div>
      )}
      {message !== "" && <span>{message}</span>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 24px 0 8px 0px;

  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
