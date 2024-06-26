import Table from "../../molecules/Table";
import { useUser } from "../../utils/context/UserContext";
import { getTeams } from "../../utils/queries";
import { FC, useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { styled } from "styled-components";

interface Props {
  small: boolean;
}

const TeamTable: FC<Props> = ({ small }) => {
  const [teamsA, setTeamsA] = useState<Team[]>([]);
  const [teamsB, setTeamsB] = useState<Team[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user?.accessToken);
          const teamATeams = teamsFromAPI.filter((t: Team) => t.group === "a");
          const teamBTeams = teamsFromAPI.filter((t: Team) => t.group === "b");
          setTeamsA(teamATeams);
          setTeamsB(teamBTeams);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllTeams();
  }, []);

  const teamColumns = small
    ? [
        { key: "name", header: "Team" },
        { key: "points", header: "P" },
        { key: "wins", header: "W" },
        { key: "draws", header: "D" },
        { key: "losses", header: "L" },
        { key: "gamesPlayed", header: "GP" },
      ]
    : [
        { key: "name", header: "Team" },
        { key: "points", header: "P" },
        { key: "wins", header: "W" },
        { key: "draws", header: "D" },
        { key: "losses", header: "L" },
        { key: "goals", header: "GF" },
        { key: "goalsAgainst", header: "GA" },
        { key: "gamesPlayed", header: "GP" },
      ];
  return (
    <Container>
      <Header>Group A</Header>
      <Table data={teamsA} columns={teamColumns}></Table>
      <Header>Group B</Header>
      <Table data={teamsB} columns={teamColumns}></Table>
    </Container>
  );
};

export default TeamTable;

const Container = styled.div`
  @media (max-width: 768px) {
    padding: 0;
  }
  padding: 24px;
`;
const Header = styled.h2`
  @media (max-width: 768px) {
    padding: 10px;
  }
`;
