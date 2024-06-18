import { MOCK_PLAYERS, MOCK_TEAMS } from "../utils/MOCK_DATA";
import Table from "../molecules/Table";

const PlayerTable = () => {
    const allPlayers = MOCK_PLAYERS;
    const playerColumns = [
        { key: 'name', header: 'Name' },
        { key: 'team', header: 'Team' },
        { key: 'position', header: 'Position' },
        { key: 'goals', header: 'Goals' },
        { key: 'assists', header: 'Assists' },
        { key: 'gamesPlayed', header: 'Games Played' },
      ];
    return <><Table data={allPlayers} columns={playerColumns}></Table></>
}

export default PlayerTable;