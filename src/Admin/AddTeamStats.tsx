import { styled } from "styled-components";

import React, { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { getTeams, updateTeamStats } from "../utils/queries";

const AddTeamStats: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updatedWins, setUpdatedWins] = useState<number>(0);
  const [updatedDraws, setUpdatedDraws] = useState<number>(0);
  const [updatedLosses, setUpdatedLosses] = useState<number>(0);
  const [updatedPoints, setUpdatedPoints] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        const teamsFromAPI = await getTeams();
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
    if (selectedTeam) {
      const updatedTeam: Team = {
        ...selectedTeam,
        wins: updatedWins,
        draws: updatedDraws,
        losses: updatedLosses,
        points: updatedPoints,
      };
      updateTeamStats(updatedTeam);
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
            <button type="submit">Update Team</button>
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
