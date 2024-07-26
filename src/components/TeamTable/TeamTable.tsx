import { getTeamsWithMetaData } from "../../utils/queries";
import { useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { styled } from "styled-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Table } from "../../molecules/Table";
import { Goal, Penalty } from "../../utils/types/Game";

interface TeamTableProps {
  small: boolean;
}
export interface TeamMetaData extends Team {
  goalsFor: Goal[];
  goalsAgainst: Goal[];
  penalties: Penalty[];
}

export const TeamTable = ({ small }: TeamTableProps) => {
  const [teamsA, setTeamsA] = useState<Team[]>([]);
  const [teamsB, setTeamsB] = useState<Team[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("A");
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (competition)
        try {
          const teamsFromAPI = await getTeamsWithMetaData(competition.id);
          const teamStatsLoop = teamsFromAPI.map((t: TeamMetaData) => {
            const gamesPlayed = t.wins + t.draws + t.losses + t.overtimeLosses;
            const points = calculatePoints(t);
            const pointPercent = calculatePointPercentage(points, gamesPlayed);
            const goals = t.goalsFor.length;
            const gAgainst = t.goalsAgainst.length;
            console.log(t.logo);
            return {
              ...t,
              gamesPlayed: gamesPlayed,
              goals: goals,
              points,
              goalsAgainst: gAgainst,
              pointPercentage: pointPercent,
            };
          });
          const teamATeams = teamStatsLoop.filter((t: Team) => t.group === "a");
          const teamBTeams = teamStatsLoop.filter((t: Team) => t.group === "b");
          setTeamsA(teamATeams);
          setTeamsB(teamBTeams);
        } catch (error) {
          console.error("Error adding teams:", error);
        }
    };

    fetchAllTeams();
  }, []);
  const calculatePoints = (team: Team) => {
    const winPoints = team.wins * 3;
    const drawPoints = team.draws;
    const OTLPoints = team.overtimeLosses;
    const totalPoints = winPoints + drawPoints + OTLPoints;
    return totalPoints;
  };
  const teamColumns = small
    ? [
        {
          key: "logo",
          header: "Team",
          render: (logo: string) => (
            <img src={logo} alt="" style={{ width: "24px", height: "24px" }} />
          ),
        },
        { key: "points", header: "P" },
        { key: "wins", header: "W" },
        { key: "draws", header: "D" },
        { key: "losses", header: "L" },
        { key: "overtimeLosses", header: "OTL" },
        { key: "gamesPlayed", header: "GP" },
      ]
    : [
        {
          key: "logo",
          header: "Team",
          render: (logo: string) => (
            <img src={logo} alt="" style={{ width: "24px", height: "24px" }} />
          ),
        },
        { key: "name", header: "" },
        { key: "points", header: "P" },
        { key: "pointPercentage", header: "P%" },
        { key: "wins", header: "W" },
        { key: "draws", header: "D" },
        { key: "losses", header: "L" },
        { key: "overtimeLosses", header: "OTL" },
        { key: "goals", header: "GF" },
        { key: "goalsAgainst", header: "GA" },
        { key: "gamesPlayed", header: "GP" },
      ];

  const toggleGroup = () => {
    setActiveGroup(activeGroup === "A" ? "B" : "A");
  };

  const getHeader = () => {
    if (activeGroup === "A") {
      if (competition?.type === "league") return "Division 1";
      if (competition?.type === "cup") return "Group A";
    }
    if (activeGroup === "B") {
      if (competition?.type === "league") return "Division 2";
      if (competition?.type === "cup") return "Group B";
    }
  };
  const calculatePointPercentage = (points: number, gamesPlayed: number) => {
    if (points === 0) return "-";
    const maxPoints = gamesPlayed * 3;

    const pointPercentage = (points / maxPoints) * 100;

    return pointPercentage;
  };
  return (
    <Container $small={small}>
      {small ? (
        <>
          <SmallHeader>
            {getHeader()}
            <LeftIconButton onClick={toggleGroup} />
            <RightIconButton onClick={toggleGroup} />{" "}
            <Link href="/#/teams">
              Go to groups
              <LinkIconButton />
            </Link>
          </SmallHeader>
          <Table
            data={activeGroup === "A" ? teamsA : teamsB}
            columns={teamColumns}
            team
            small
          />
        </>
      ) : (
        <>
          <Header>
            {competition?.type === "cup" ? "Group A" : "Division 1"}
          </Header>
          {teamsA.length ? (
            <Table data={teamsA} columns={teamColumns} team />
          ) : (
            <NoTeamsText>No teams in group</NoTeamsText>
          )}
          <Header>
            {competition?.type === "cup" ? "Group B" : "Division 2"}
          </Header>
          {teamsB.length ? (
            <Table data={teamsB} columns={teamColumns} team />
          ) : (
            <NoTeamsText>No teams in group</NoTeamsText>
          )}
        </>
      )}
    </Container>
  );
};

const Container = styled.div<{ $small: boolean }>`
  @media (max-width: 768px) {
    padding: ${(props) => (props.$small ? "0" : "20px")};
    padding-bottom: 50px;
    min-height: ${(props) => (props.$small ? "0" : "500px")};
  }
  padding: ${(props) => (props.$small ? "0" : "24px")};
`;

const Header = styled.h2`
  @media (max-width: 768px) {
    padding: 10px;
  }
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

const NoTeamsText = styled.h2`
  margin: auto;
  padding: 24px;
`;
