import Table from "../../molecules/Table";
import { MOCK_TEAMS } from "../../utils/MOCK_DATA";

const TeamTable = () => {
  const allTeams = MOCK_TEAMS;
  const teamColumns = [
    { key: "name", header: "Name" },
    { key: "points", header: "Points" },
    { key: "wins", header: "Wins" },
    { key: "draws", header: "Draws" },
    { key: "losses", header: "Losses" },
    { key: "gamesPlayed", header: "Games Played" },
  ];
  return (
    <>
      <Table data={allTeams} columns={teamColumns}></Table>
    </>
  );
};

export default TeamTable;
