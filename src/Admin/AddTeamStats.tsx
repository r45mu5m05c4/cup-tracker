import { styled } from "styled-components";

import React, { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { getTeams, updateTeamStats } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { useCompetition } from "../utils/context/CompetitionContext";

const AddTeamStats: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [updatedWins, setUpdatedWins] = useState<number>(0);
  const [updatedDraws, setUpdatedDraws] = useState<number>(0);
  const [updatedLosses, setUpdatedLosses] = useState<number>(0);
  const [updatedPoints, setUpdatedPoints] = useState<number>(0);
  const [updatedGoals, setUpdatedGoals] = useState<number>(0);
  const [updatedGoalsAgainst, setUpdatedGoalsAgainst] = useState<number>(0);
  const [updatedGamesPlayed, setUpdatedGamesPlayed] = useState<number>(0);
  const [updatedGroup, setUpdatedGroup] = useState<string>("");
  const [updatedPlayoffGroup, setUpdatedPlayoffGroup] = useState<string>("");
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
      setUpdatedGoals(foundTeam.goals);
      setUpdatedGoalsAgainst(foundTeam.goalsAgainst);
      setUpdatedGamesPlayed(foundTeam.gamesPlayed);
      setUpdatedGroup(foundTeam.group);
      setUpdatedPlayoffGroup(foundTeam.playoffGroup);
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
          goals: updatedGoals,
          goalsAgainst: updatedGoalsAgainst,
          gamesPlayed: updatedGamesPlayed,
          group: updatedGroup,
          playoffGroup: updatedPlayoffGroup,
        };
        try {
          updateTeamStats(updatedTeam, user?.accessToken);
          setMessage(`Successfully updated ${selectedTeam.name}`);
        } catch (e) {
          setMessage("Update failed");
        }
      }
  };

  return (
    <Container>
      <h2>Admin Page - Update Teams</h2>
      <Select onChange={(e) => handleTeamSelect(e.target.value)}>
        <option value="">Select a team to update</option>
        {teams.map((team) => (
          <option key={team._id} value={team._id}>
            {team.name}
          </option>
        ))}
      </Select>
      {selectedTeam && (
        <div>
          <h3>Update Team: {selectedTeam.name}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTeam();
            }}
          >
            <Label>
              Wins:
              <input
                type="number"
                value={updatedWins}
                onChange={(e) => setUpdatedWins(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Draws:
              <input
                type="number"
                value={updatedDraws}
                onChange={(e) => setUpdatedDraws(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Losses:
              <input
                type="number"
                value={updatedLosses}
                onChange={(e) => setUpdatedLosses(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Points:
              <input
                type="number"
                value={updatedPoints}
                onChange={(e) => setUpdatedPoints(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Goals:
              <input
                type="number"
                value={updatedGoals}
                onChange={(e) => setUpdatedGoals(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Goals against:
              <input
                type="number"
                value={updatedGoalsAgainst}
                onChange={(e) =>
                  setUpdatedGoalsAgainst(parseInt(e.target.value))
                }
              />
            </Label>
            <br />
            <Label>
              Games played:
              <input
                type="number"
                value={updatedGamesPlayed}
                onChange={(e) =>
                  setUpdatedGamesPlayed(parseInt(e.target.value))
                }
              />
            </Label>
            <br />
            <Label>
              Group:
              <Select
                value={updatedGroup}
                onChange={(e) => setUpdatedGroup(e.target.value)}
              >
                <option value="">Select group</option>
                <option value="A">Group A</option>
                <option value="B">Group B</option>
              </Select>
            </Label>
            <br />
            <Label>
              Playoff group:
              <Select
                value={updatedPlayoffGroup}
                onChange={(e) => setUpdatedPlayoffGroup(e.target.value)}
              >
                <option value="">Select group</option>
                <option value="A">Playoff group A</option>
                <option value="B">Playoff group B</option>
              </Select>
            </Label>
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
  margin: auto;
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
  margin: 24px;
  &:disabled {
    background-color: #bababa;
    cursor: default;
    &:hover {
      border: 1px solid transparent;
    }
  }
`;
const Label = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: auto;
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
