import Table from "../molecules/Table";
import { getTeams } from "../utils/queries";
import { useEffect, useState } from "react";

const TeamTable = () => {
  const [teams, setTeams] = useState<any[]>([]);

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
  const teamColumns = [
    { key: "name", header: "Name" },
    { key: "points", header: "Points" },
    { key: "wins", header: "Wins" },
    { key: "draws", header: "Draws" },
    { key: "losses", header: "Losses" },
  ];
  return (
    <>
      <Table data={teams} columns={teamColumns}></Table>
    </>
  );
};

export default TeamTable;
