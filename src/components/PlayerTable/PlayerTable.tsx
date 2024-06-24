import { useEffect, useState } from "react";
import Table from "../../molecules/Table";
import { useUser } from "../../utils/context/UserContext";
import { getPlayers } from "../../utils/queries";

const PlayerTable = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllPlayers = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getPlayers(user?.accessToken);
          console.log(teamsFromAPI);
          setPlayers(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllPlayers();
  }, []);

  const playerColumns = [
    { key: "name", header: "Name" },
    { key: "teamName", header: "Team" },
    { key: "position", header: "Position" },
    { key: "goals", header: "Goals" },
    { key: "assists", header: "Assists" },
    { key: "gamesPlayed", header: "Games Played" },
  ];
  return (
    <>
      <Table data={players} columns={playerColumns}></Table>
    </>
  );
};

export default PlayerTable;
