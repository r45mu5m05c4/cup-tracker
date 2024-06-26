import Table from "../../molecules/Table";
import { useUser } from "../../utils/context/UserContext";
import { getTeams } from "../../utils/queries";
import { FC, useEffect, useState } from "react";

interface Props {
  small: boolean;
}

const TeamTable: FC<Props> = ({ small }) => {
  const [teams, setTeams] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user?.accessToken);
          setTeams(teamsFromAPI);
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
    <>
      <Table data={teams} columns={teamColumns}></Table>
    </>
  );
};

export default TeamTable;
