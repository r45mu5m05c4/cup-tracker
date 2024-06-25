import { styled } from "styled-components";

import React, { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { addPlayer, getTeams } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { PlayerPosition } from "../utils/types/Player";

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

const AddPlayer: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [jerseyNumber, setJerseyNumber] = useState<number>(0);
  const [position, setPosition] = useState<PlayerPosition>(
    PlayerPosition.Center
  );
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
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

  const handleTeamSelect = (teamId: string) => {
    const foundTeam = teams.find((team) => team._id === teamId);
    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
  };

  const handleAddPlayer = () => {
    if (user?.accessToken) {
      if (selectedTeam && position) {
        const newPlayer: NewPlayer = {
          name: playerName,
          goals: 0,
          assists: 0,
          points: 0,
          penaltyMinutes: 0,
          gamesPlayed: 0,
          position: position,
          jerseyNumber: jerseyNumber,
          teamName: selectedTeam.name,
        };
        console.log(newPlayer);
        addPlayer(newPlayer, user?.accessToken);
        setMessage(`Successfully added ${newPlayer.name}`);
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
      <select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team to add a player to</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>
      {selectedTeam && (
        <div>
          <h3>Add player to: {selectedTeam.name}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddPlayer();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
            </label>
            <br />
            <label>
              Jersey Number:
              <input
                type="number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
              />
            </label>
            <br />
            <label>
              Position:
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              >
                {possiblePlayerPositions.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
            </label>
            <br />
            <Button type="submit">Add Player</Button>
          </form>
        </div>
      )}
      {message !== "" && <span>{message}</span>}
    </Container>
  );
};

export default AddPlayer;

const Container = styled.div`
  height: 100%;
  width: 100%;
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
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
`;
