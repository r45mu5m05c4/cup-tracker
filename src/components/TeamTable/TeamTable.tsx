import Table from "../../molecules/Table";
import { useUser } from "../../utils/context/UserContext";
import { getTeams } from "../../utils/queries";
import { useEffect, useState } from "react";

const TeamTable = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const { user } = useUser();
  
  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user?.accessToken);
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
