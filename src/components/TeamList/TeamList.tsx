import { useState, useEffect } from "react";
import styled from "styled-components";
import { Team } from "../../utils/types/Team";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { getTeams } from "../../utils/queries";
import { logoItems } from "../../utils/Logos";
import { TeamProfile } from "../TeamProfile/TeamProfile";
import { Logo } from "../../utils/types/Logo";

export const TeamList = () => {
  const [teamsA, setTeamsA] = useState<Team[]>([]);
  const [teamsB, setTeamsB] = useState<Team[]>([]);
  const [openTeam, setOpenTeam] = useState<Team>();
  const [showTeamModal, setShowTeamModal] = useState(false);
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (competition)
        try {
          const teamsFromAPI = await getTeams(competition.id);
          const teamLogoLoop = teamsFromAPI.map((t: Team) => {
            const teamLogo = logoItems.find((l: Logo) => t.name === l.teamName);

            return {
              ...t,
              logo: teamLogo?.logo,
            };
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
  }, []);

  const handleItemClick = (item: Team) => {
    setOpenTeam(item);
    setShowTeamModal(true);
  };
  return (
    <Container>
      {showTeamModal && openTeam && (
        <TeamProfile team={openTeam} setShowModal={setShowTeamModal} />
      )}
      <GroupContainer>
        {competition?.type === "cup" ? <h2>Group A</h2> : <h2>Div 1</h2>}

        {teamsA.map((t: Team) => (
          <TeamCard key={t.name} onClick={() => handleItemClick(t)}>
            <img src={t.logo} style={{ width: "50px" }} />
            <h3>{t.name}</h3>
          </TeamCard>
        ))}
      </GroupContainer>
      <GroupContainer>
        {competition?.type === "cup" ? <h2>Group B</h2> : <h2>Div 2</h2>}

        {teamsB.map((t: Team) => (
          <TeamCard key={t.name} onClick={() => handleItemClick(t)}>
            <img src={t.logo} style={{ width: "50px" }} />
            <h3>{t.name}</h3>
          </TeamCard>
        ))}
      </GroupContainer>
    </Container>
  );
};
const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;
  padding: 14px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px;
  align-items: center;
  width: 45%;
  margin: auto;
  margin-top: 0;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const TeamCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  border: 1px solid var(--decorative-brand-light);
  margin-top: 5px;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  gap: 24px;
  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: row;
  }
`;
