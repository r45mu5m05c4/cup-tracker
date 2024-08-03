import { useEffect, useState } from "react";
import { getPlayersWithMetaData } from "../../utils/queries";
import { styled } from "styled-components";
import { Player, PlayerMetaData } from "../../utils/types/Player";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Table } from "../../molecules/Table";
import { Typography } from "../../molecules/Typography";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { Penalty } from "../../utils/types/Game";

interface PlayerTableProps {
  small: boolean;
}

export const PlayerTable = ({ small }: PlayerTableProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [goalies, setGoalies] = useState<Player[]>([]);
  const [activePlayers, setActivePlayers] = useState<string>("Players");
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllPlayers = async () => {
      if (competition) {
        try {
          const playersFromAPI = await getPlayersWithMetaData(competition.id);

          const formattedPlayers = playersFromAPI.map((p: PlayerMetaData) => {
            const points =
              p.goals.length + p.assists.length + p.secondaryAssists.length;
            const ppg = calculatePointPerGame(points, p.gamesPlayed);
            const totalAssists = p.assists.length + p.secondaryAssists.length;
            const goals = p.goals.length;
            const penaltyMinutes = p.penalties.length
              ? getPenaltyMinutes(p.penalties)
              : 0;
            if (
              p.position === "G" &&
              p.saves !== undefined &&
              p.goalsAgainst !== undefined
            ) {
              const savePercent: number =
                p.goalsAgainst === 0
                  ? 100
                  : parseInt(
                      ((p.saves / (p.saves + p.goalsAgainst)) * 100).toFixed(2)
                    );
              return {
                ...p,
                logo: p.team.logo,
                savePercent,
                goals,
                points,
                totalAssists,
                penaltyMinutes,
              };
            }
            return {
              ...p,
              points,
              logo: p.team.logo,
              goals,
              totalAssists,
              ppg,
              penaltyMinutes,
            };
          });
          setPlayers(formattedPlayers.filter((p: any) => p.position !== "G"));
          setGoalies(formattedPlayers.filter((p: any) => p.position === "G"));
        } catch (error) {
          console.error("Error fetching players:", error);
        }
      }
    };

    fetchAllPlayers();
  }, [competition]);
  const getPenaltyMinutes = (penalties: Penalty[]) => {
    return penalties.reduce((total, p) => total + p.penaltyMinutes, 0);
  };
  const calculatePointPerGame = (points: number, gamesPlayed: number) => {
    if (points === 0 || gamesPlayed === 0) return "-";

    const pointPerGame = (points / gamesPlayed).toFixed(2);

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
        {
          key: "goals",
          header: "G",
          render: (goals: []) => (goals.length ? goals.length : 0),
        },
        {
          key: "totalAssists",
          header: "A",
        },
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
        { key: "totalAssists", header: "A" },
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
