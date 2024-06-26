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

interface Props {
  small: boolean;
}

const TeamTable: FC<Props> = ({ small }) => {
  const [teamsA, setTeamsA] = useState<Team[]>([]);
  const [teamsB, setTeamsB] = useState<Team[]>([]);
  const [activeGroup, setActiveGroup] = useState<string>("A");
  const { user } = useUser();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user.accessToken);
          const teamLogoLoop = teamsFromAPI.map((t: Team) => {
            const teamLogo = logoItems.find((l: Logo) => t.name === l.teamName);

            return { ...t, logo: teamLogo?.logo };
          });
          console.log(teamLogoLoop);
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
            <img
              src={logo}
              alt="Team Logo"
              style={{ width: "20px", height: "20px" }}
            />
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
            <img
              src={logo}
              alt="Team Logo"
              style={{ width: "20px", height: "20px" }}
            />
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

  return (
    <Container $small={small}>
      {small ? (
        <>
          <SmallHeader>
            {activeGroup === "A" ? "Group A" : "Group B"}
            <LeftIconButton onClick={toggleGroup} />
            <RightIconButton onClick={toggleGroup} />
          </SmallHeader>
          <Table
            data={activeGroup === "A" ? teamsA : teamsB}
            columns={teamColumns}
          />
          <Link href="/#/teams">
            Go to groups
            <LinkIconButton />
          </Link>
        </>
      ) : (
        <>
          <Header>Group A</Header>
          <Table data={teamsA} columns={teamColumns} />
          <Header>Group B</Header>
          <Table data={teamsB} columns={teamColumns} />
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
  border-bottom: 0.5px solid;
  padding: 10px;
  font-weight: 500;
`;

const Link = styled.a`
  display: flex;
  align-items: center;
  color: #000;
  padding: 10px;
  &:hover {
    color: #42917e;
  }
`;
