import { useEffect, useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import { getPlayers } from "../../utils/queries";
import { styled } from "styled-components";
import { Player } from "../../utils/types/Player";
import { Logo } from "../../utils/types/Logo";
import { logoItems } from "../../utils/Logos";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Table } from "../../molecules/Table";
import { Typography } from "../../molecules/Typography";

interface PlayerTableProps {
  small: boolean;
}

export const PlayerTable = ({ small }: PlayerTableProps) => {
  const [players, setPlayers] = useState<any[]>([]);
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllPlayers = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const playersFromAPI = await getPlayers(
            user?.accessToken,
            competition.name
          );
          const playersWithLogo = playersFromAPI.map((p: Player) => {
            const teamLogo = logoItems.find(
              (l: Logo) => p.teamName === l.teamName
            );

            return { ...p, logo: teamLogo?.logo };
          });
          if (isMobileDevice()) {
            const abbreviatedPlayers = playersWithLogo.map((p: Player) => {
              p.name = abbreviateName(p.name);
              return p;
            });
            setPlayers(abbreviatedPlayers);
          } else setPlayers(playersWithLogo);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllPlayers();
  }, []);

  const abbreviateName = (fullName: string) => {
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
  };
  const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
  };

  const playerColumns = small
    ? [
        { key: "name", header: "Name" },
        {
          key: "logo",
          header: "Team",
          render: (logo: string) => (
            <img
              src={logo}
              alt="team"
              style={{ width: "20px", height: "20px" }}
            />
          ),
        },
        { key: "goals", header: "G" },
        { key: "assists", header: "A" },
        { key: "points", header: "P" },
      ]
    : [
        { key: "name", header: "Name" },
        { key: "jerseyNumber", header: "#" },
        {
          key: "logo",
          header: "Team",
          render: (logo: string) => (
            <img
              src={logo}
              alt="team"
              style={{ width: "20px", height: "20px" }}
            />
          ),
        },
        { key: "position", header: "Pos" },
        { key: "goals", header: "G" },
        { key: "assists", header: "A" },
        { key: "points", header: "P" },
        { key: "gamesPlayed", header: "GP" },
        { key: "penaltyMinutes", header: "PIM" },
      ];

  return (
    <Container $small={small}>
      {players.length ? (
        <Table data={players} columns={playerColumns}></Table>
      ) : (
        <Typography variant="p" style={{ padding: "12px 24px" }}>
          No players registered yet.
        </Typography>
      )}
    </Container>
  );
};

const Container = styled.div<{ $small: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: ${(props) => (props.$small ? "0" : "24px")};

  @media (max-width: 768px) {
    padding: 0;
    padding-bottom: ${(props) => (props.$small ? "0" : "50px")};
    min-height: ${(props) => (props.$small ? "0" : "500px")};
  }
`;
