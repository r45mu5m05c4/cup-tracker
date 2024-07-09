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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface PlayerTableProps {
  small: boolean;
}

export const PlayerTable = ({ small }: PlayerTableProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [goalies, setGoalies] = useState<Player[]>([]);
  const [activePlayers, setActivePlayers] = useState<string>("Players");
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllPlayers = async () => {
      if (user?.accessToken && competition) {
        try {
          await refreshAccessToken();
          const playersFromAPI = await getPlayers(
            user.accessToken,
            competition.name
          );
          const playersWithLogo = playersFromAPI.map((p: Player) => {
            const teamLogo = logoItems.find(
              (l: Logo) => p.teamName === l.teamName
            );
            return { ...p, logo: teamLogo?.logo };
          });
          const formattedPlayers = playersWithLogo.map((p: Player) => {
            if (
              p.position === "G" &&
              p.saves !== undefined &&
              p.goalsAgainst !== undefined
            ) {
              const savePercent =
                p.goalsAgainst === 0
                  ? 100
                  : ((p.saves / (p.saves + p.goalsAgainst)) * 100).toFixed(2);
              return { ...p, savePercent };
            }
            const ppg = calculatePointPerGame(p.points, p.gamesPlayed);
            return { ...p, ppg };
          });
          setPlayers(
            formattedPlayers.filter((p: Player) => p.position !== "G")
          );
          setGoalies(
            formattedPlayers.filter((p: Player) => p.position === "G")
          );
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }
    };

    fetchAllPlayers();
  }, []);

  const calculatePointPerGame = (points: number, gamesPlayed: number) => {
    if (points === 0) return "-";

    const pointPerGame = points / gamesPlayed;

    return pointPerGame;
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
        { key: "ppg", header: "PPG" },
        { key: "gamesPlayed", header: "GP" },
        { key: "penaltyMinutes", header: "PIM" },
      ];

  const goalieColumns = small
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
        { key: "saves", header: "SV" },
        { key: "goalsAgainst", header: "GA" },
        { key: "wins", header: "W" },
        { key: "savePercent", header: "SV%" },
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
        { key: "saves", header: "SV" },
        { key: "goalsAgainst", header: "GA" },
        { key: "savePercent", header: "SV%" },
        { key: "wins", header: "W" },
        { key: "gamesPlayed", header: "GP" },
        { key: "goals", header: "G" },
        { key: "assists", header: "A" },
        { key: "points", header: "P" },
        { key: "penaltyMinutes", header: "PIM" },
      ];

  const togglePlayers = () => {
    setActivePlayers(activePlayers === "Players" ? "Goalies" : "Players");
  };

  return (
    <Container $small={small}>
      {!small ? (
        <>
          <Header>Players</Header>
          {players.length ? (
            <Table
              data={players}
              columns={playerColumns}
              small={small}
              className="player-table"
            />
          ) : (
            <Typography style={{ padding: "12px 24px" }}>
              No players registered yet.
            </Typography>
          )}
        </>
      ) : (
        <>
          <SmallHeader>
            {activePlayers}
            <LeftIconButton onClick={togglePlayers} />
            <RightIconButton onClick={togglePlayers} />
            <Link href="/#/players">
              Go to player stats
              <LinkIconButton />
            </Link>
          </SmallHeader>
          <Table
            data={activePlayers === "Players" ? players : goalies}
            columns={
              activePlayers === "Players" ? playerColumns : goalieColumns
            }
            small
          />
        </>
      )}

      {!small && (
        <>
          <Header>Goalies</Header>
          {goalies.length ? (
            <Table
              data={goalies}
              columns={goalieColumns}
              small={small}
              className="goalie-table"
            />
          ) : (
            <Typography style={{ padding: "12px 24px" }}>
              No goalies registered yet.
            </Typography>
          )}
        </>
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
    padding: ${(props) => (props.$small ? "0" : "20px")};
    min-height: ${(props) => (props.$small ? "0" : "500px")};
  }
`;
const Header = styled.h2`
  @media (max-width: 768px) {
    padding: 10px;
  }
`;
const SmallHeader = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  border-bottom: 0.5px solid var(--neutral-border-onContrast);
  padding: 6px 10px;
  font-weight: 500;
  font-size: 0.8em;
  background-color: var(--neutral-surface-third);
`;
const RightIconButton = styled(ChevronRightIcon)`
  height: 20px;
  cursor: pointer;
  &:hover {
    color: var(--decorative-brand-light);
  }
`;

const LeftIconButton = styled(ChevronLeftIcon)`
  height: 20px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: var(--decorative-brand-light);
  }
`;

const LinkIconButton = styled(ArrowLongRightIcon)`
  height: 20px;
  cursor: pointer;
  margin: auto;
  margin-left: 5px;
`;
const Link = styled.a`
  display: flex;
  align-items: center;
  color: var(--text-base);
  padding: 10px 0;
  margin-left: auto;
  margin-right: 0;
  &:hover {
    color: var(--decorative-brand-light);
  }
`;
