import { FC, useEffect, useState } from "react";
import Table from "../../molecules/Table";
import { useUser } from "../../utils/context/UserContext";
import { getPlayers } from "../../utils/queries";
interface Props {
  small: boolean;
}

const PlayerTable: FC<Props> = ({ small }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllPlayers = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getPlayers(user?.accessToken);
          if (isMobileDevice()) {
            const abbreviatedPlayers = players.map((p) => {
              p.name = abbreviateName(p.name);
              return p;
            });
            setPlayers(abbreviatedPlayers);
          } else setPlayers(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllPlayers();
  }, []);

  function abbreviateName(fullName: string) {
    const nameParts = fullName.split(" ");

    if (nameParts.length >= 2) {
      const abbreviatedFirstName = nameParts[0].charAt(0) + ".";

      const abbreviatedName = [
        abbreviatedFirstName,
        ...nameParts.slice(1),
      ].join(" ");

      return abbreviatedName;
    }

    return fullName;
  }
  function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  const playerColumns = small
    ? [
        { key: "name", header: "Name" },
        { key: "goals", header: "G" },
        { key: "assists", header: "A" },
        { key: "points", header: "P" },
      ]
    : [
        { key: "name", header: "Name" },
        { key: "jerseyNumber", header: "#" },
        { key: "teamName", header: "Team" },
        { key: "position", header: "Pos" },
        { key: "goals", header: "G" },
        { key: "assists", header: "A" },
        { key: "points", header: "P" },
        { key: "gamesPlayed", header: "GP" },
        { key: "penaltyMinutes", header: "PIM" },
      ];

  return (
    <>
      <Table data={players} columns={playerColumns}></Table>
    </>
  );
};

export default PlayerTable;
