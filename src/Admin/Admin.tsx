import { styled } from "styled-components";
import React, { useState } from "react";
import AddTeamStats from "./AddTeamStats";
import AddPlayer from "./AddPlayer";
import UpdatePlayers from "./UpdatePlayers";
import ScheduleGame from "./ScheduleGame";
import GameManager from "./GameManager";
import RemoveGame from "./RemoveGame";
import RemovePlayer from "./RemovePlayer";
import AddLogo from "./AddLogo";

const Admin: React.FC = () => {
  const [currentAdminPage, setCurrentAdminPage] = useState("");
  const showAdminPage = () => {
    switch (currentAdminPage) {
      case "teamStats":
        return <AddTeamStats />;
      case "teamLogo":
        return <AddLogo />;
      case "playerStats":
        return <UpdatePlayers />;
      case "addPlayer":
        return <AddPlayer />;
      case "removePlayer":
        return <RemovePlayer />;
      case "addGame":
        return <ScheduleGame />;
      case "removeGame":
        return <RemoveGame />;
      case "updateGame":
        return <GameManager />;
      default:
        break;
    }
  };
  return (
    <Container>
      {currentAdminPage !== "" && (
        <AdminButton onClick={() => setCurrentAdminPage("")}>
          Back to admin
        </AdminButton>
      )}
      {currentAdminPage === "" ? (
        <>
          <TeamControlContainer>
            <h3>Team</h3>
            <AdminButton onClick={() => setCurrentAdminPage("teamStats")}>
              Update a teams stats
            </AdminButton>
            <AdminButton onClick={() => setCurrentAdminPage("teamLogo")}>
              Update/add a teams logo
            </AdminButton>
          </TeamControlContainer>
          <PlayerControlContainer>
            <h3>Player</h3>
            <AdminButton onClick={() => setCurrentAdminPage("playerStats")}>
              Update a player
            </AdminButton>
            <AdminButton onClick={() => setCurrentAdminPage("addPlayer")}>
              Add player
            </AdminButton>
            <AdminButton onClick={() => setCurrentAdminPage("removePlayer")}>
              Remove player
            </AdminButton>
          </PlayerControlContainer>
          <GameControlContainer>
            <h3>Game</h3>
            <AdminButton onClick={() => setCurrentAdminPage("addGame")}>
              Add game
            </AdminButton>
            <AdminButton onClick={() => setCurrentAdminPage("removeGame")}>
              Remove game
            </AdminButton>
            <AdminButton onClick={() => setCurrentAdminPage("updateGame")}>
              Live game manager
            </AdminButton>
          </GameControlContainer>
        </>
      ) : (
        showAdminPage()
      )}
    </Container>
  );
};

export default Admin;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const AdminButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: var(--text-muted);
  color: var(--text-base);
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 24px;
`;
const TeamControlContainer = styled.div`
  padding-left: 5px;
  display: flex;
  flex-direction: column;
`;
const PlayerControlContainer = styled.div`
  padding-left: 5px;
  border-left: 1px solid;
  display: flex;
  flex-direction: column;
`;
const GameControlContainer = styled.div`
  padding-left: 5px;
  border-left: 1px solid;
  display: flex;
  flex-direction: column;
`;
