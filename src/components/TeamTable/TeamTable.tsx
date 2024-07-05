import Table from "../../molecules/Table";
import { useUser } from "../../utils/context/UserContext";
import { getTeams } from "../../utils/queries";
import { FC, useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { styled } from "styled-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { Logo } from "../../utils/types/Logo";
import { logoItems } from "../../utils/Logos";
import { useCompetition } from "../../utils/context/CompetitionContext";

interface Props {
  small: boolean;
}

const TeamTable: FC<Props> = ({ small }) => {
  const [teamsA, setTeamsA] = useState<Team[]>([]);
  const [teamsB, setTeamsB] = useState<Team[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("A");
  const { user } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken && competition)
        try {
          const teamsFromAPI = await getTeams(
            user.accessToken,
            competition.name
          );
          const teamLogoLoop = teamsFromAPI.map((t: Team) => {
            const teamLogo = logoItems.find((l: Logo) => t.name === l.teamName);

            return { ...t, logo: teamLogo?.logo };
          });
          const teamATeams = teamLogoLoop.filter((t: Team) => t.group === "a");
          const teamBTeams = teamLogoLoop.filter((t: Team) => t.group === "b");
          setTeamsA(teamATeams);
          setTeamsB(teamBTeams);
        } catch (error) {
          console.error("Error adding teams:", error);
        }
    };

    fetchAllTeams();
  }, [user]);

  const teamColumns = small
    ? [
      {
        key: "logo",
        header: "Team",
        render: (logo: string) => (
          <img src={logo} alt="" style={{ width: "20px", height: "20px" }} />
        ),
      },
      { key: "points", header: "P" },
      { key: "wins", header: "W" },
      { key: "draws", header: "D" },
      { key: "losses", header: "L" },
      { key: "gamesPlayed", header: "GP" },
    ]
    : [
      {
        key: "logo",
        header: "Team",
        render: (logo: string) => (
          <img src={logo} alt="" style={{ width: "20px", height: "20px" }} />
        ),
      },
      { key: "name", header: "" },
      { key: "points", header: "P" },
      { key: "wins", header: "W" },
      { key: "draws", header: "D" },
      { key: "losses", header: "L" },
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
          />
        </>
      ) : (
        <>
          <Header>
            {competition?.type === "cup" ? "Group A" : "Division 1"}
          </Header>
          {teamsA.length ? (
            <Table data={teamsA} columns={teamColumns} />
          ) : (
            <NoTeamsText>No teams in group</NoTeamsText>
          )}
          <Header>
            {competition?.type === "cup" ? "Group B" : "Division 2"}
          </Header>
          {teamsB.length ? (
            <Table data={teamsB} columns={teamColumns} />
          ) : (
            <NoTeamsText>No teams in group</NoTeamsText>
          )}
        </>
      )}
    </Container>
  );
};

export default TeamTable;

const Container = styled.div<{ $small: boolean }>`
  @media (max-width: 768px) {
    padding: 0;
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
    color: #42917e;
  }
`;

const LeftIconButton = styled(ChevronLeftIcon)`
  height: 20px;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: #42917e;
  }
`;

const LinkIconButton = styled(ArrowLongRightIcon)`
  height: 20px;
  cursor: pointer;
  margin: auto;
  margin-left: 5px;
`;

const SmallHeader = styled.div`
  height: 10%;
  display: flex;
  align-items: center;
  border-bottom: 0.5px solid #0E4051;
  padding: 10px;
  font-weight: 500;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  color: white;
  padding: 10px;
  margin-left: auto;
  margin-right: 0;
  &:hover {
    color: #42917e;
  }
`;
const NoTeamsText = styled.h2`
  margin: auto;
`;
