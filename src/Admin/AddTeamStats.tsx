import { styled } from "styled-components";

import { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { getTeams, updateTeamStats } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { useCompetition } from "../utils/context/CompetitionContext";
import { Select } from "../molecules/Select";
import { Button } from "../molecules/Button";
import { Typography } from "../molecules/Typography";

export const AddTeamStats = () => {
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
      <Select
        label="Teams"
        placeholder="Select team"
        options={teams.map((team) => ({
          value: team._id,
          label: team.name,
        }))}
        onChange={(e) => handleTeamSelect(e.target.value)}
      />
      {selectedTeam && (
        <div>
          <Typography style={{ fontWeight: "600", margin: "32px 0 24px 0" }}>
            Updating team: {selectedTeam.name}
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTeam();
            }}
          >
            <Label>
              Wins
              <input
                type="number"
                value={updatedWins}
                onChange={(e) => setUpdatedWins(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Draws
              <input
                type="number"
                value={updatedDraws}
                onChange={(e) => setUpdatedDraws(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Losses
              <input
                type="number"
                value={updatedLosses}
                onChange={(e) => setUpdatedLosses(parseInt(e.target.value))}
              />
            </Label>
            <br />
            <Label>
              Points
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
            <br />

            <Select
              label="Group"
              value={updatedGroup}
              placeholder="Select group"
              options={[
                { label: "Group A", value: "a" },
                { label: "Group B", value: "b" },
              ]}
              onChange={(e) => setUpdatedGroup(e.target.value)}
            />

            <br />
            <br />

            <Select
              label="Playoff group"
              value={updatedPlayoffGroup}
              placeholder="Select group"
              options={[
                { label: "Playoff group A", value: "a" },
                { label: "Playoff group B", value: "b" },
              ]}
              onChange={(e) => setUpdatedPlayoffGroup(e.target.value)}
            />

            <br />
            <div style={{ marginTop: "24px" }}>
              <Button type="submit" onClick={() => {}}>
                Update Team
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
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  gap: 14px;

  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
