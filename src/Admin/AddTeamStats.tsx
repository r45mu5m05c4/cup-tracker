import { styled } from "styled-components";

import React, { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { getTeams, updateTeamStats } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";

const AddTeamStats: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updatedWins, setUpdatedWins] = useState<number>(0);
  const [updatedDraws, setUpdatedDraws] = useState<number>(0);
  const [updatedLosses, setUpdatedLosses] = useState<number>(0);
  const [updatedPoints, setUpdatedPoints] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user.accessToken);
          console.log(teamsFromAPI);
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllTeams();
  }, []);

  const handleTeamSelect = (teamId: string) => {
    const foundTeam = teams.find((team) => team._id === teamId);
    console.log(foundTeam);
    if (foundTeam) {
      setSelectedTeam(foundTeam);
      setUpdatedWins(foundTeam.wins);
      setUpdatedDraws(foundTeam.draws);
      setUpdatedLosses(foundTeam.losses);
      setUpdatedPoints(foundTeam.points);
    }
  };

  const handleUpdateTeam = () => {
    if (user?.accessToken)
      if (selectedTeam) {
        const updatedTeam: Team = {
          ...selectedTeam,
          wins: updatedWins,
          draws: updatedDraws,
          losses: updatedLosses,
          points: updatedPoints,
        };
        updateTeamStats(updatedTeam, user?.accessToken);
        setMessage(`Successfully updated ${selectedTeam.name}`);
      }
  };

  return (
    <Container>
      <h2>Admin Page - Update Teams</h2>
      <select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team to update</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </select>
      {selectedTeam && (
        <div>
          <h3>Update Team: {selectedTeam.name}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTeam();
            }}
          >
            <label>
              Wins:
              <input
                type="number"
                value={updatedWins}
                onChange={(e) => setUpdatedWins(parseInt(e.target.value))}
              />
            </label>
            <br />
            <label>
              Draws:
              <input
                type="number"
                value={updatedDraws}
                onChange={(e) => setUpdatedDraws(parseInt(e.target.value))}
              />
            </label>
            <br />
            <label>
              Losses:
              <input
                type="number"
                value={updatedLosses}
                onChange={(e) => setUpdatedLosses(parseInt(e.target.value))}
              />
            </label>
            <br />
            <label>
              Points:
              <input
                type="number"
                value={updatedPoints}
                onChange={(e) => setUpdatedPoints(parseInt(e.target.value))}
              />
            </label>
            <br />
            <Button type="submit">Update Team</Button>
          </form>
        </div>
      )}
      {message !== "" && <span>{message}</span>}
    </Container>
  );
};

export default AddTeamStats;

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
  margin: auto;
`;
