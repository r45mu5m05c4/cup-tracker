import { styled } from "styled-components";
import { TeamList } from "./TeamManager/TeamList";
import { Tabs } from "../molecules/Tabs";
import { Typography } from "../molecules/Typography";
import { PlayerList } from "./PlayerManager/PlayerList";
import GameList from "./GameManager";

export const Admin = () => {
  const tabs = [
    {
      label: "Game",
      content: (
        <TabContentContainer>
          <Typography variant="h4">Manage games</Typography>
          <GameList />
        </TabContentContainer>
      ),
    },
    {
      label: "Team",
      content: (
        <TabContentContainer>
          <Typography variant="h4">Manage teams</Typography>
          <TeamList />
        </TabContentContainer>
      ),
    },
    {
      label: "Player",
      content: (
        <TabContentContainer>
          <Typography variant="h4">Manage players</Typography>
          <PlayerList />
        </TabContentContainer>
      ),
    },
  ];

  return (
    <Container>
      <Typography variant="h2">Tournament settings</Typography>
      <Tabs items={tabs} />
    </Container>
  );
};

const Container = styled.div`
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  padding: 24px 24px 42px 24px;
  margin: 14px 14px 32px 14px;
  background-color: var(--neutral-surface-contrast);
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TabContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 8px;
  padding: 8px;
`;
