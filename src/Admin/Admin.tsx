import { styled } from "styled-components";
import React, { useState } from "react";
import AddTeamStats from "./AddTeamStats";
import AddPlayer from "./AddPlayer";
import UpdatePlayers from "./UpdatePlayers";
import ScheduleGame from "./ScheduleGame";
import GameManager from "./GameManager";
import RemoveGame from "./RemoveGame";
import RemovePlayer from "./RemovePlayer";

const Admin: React.FC = () => {
  const [currentAdminPage, setCurrentAdminPage] = useState("");
  const showAdminPage = () => {
    switch (currentAdminPage) {
      case "teamStats":
        return <AddTeamStats />;
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
          <AdminButton onClick={() => setCurrentAdminPage("teamStats")}>
            Update a teams stats
          </AdminButton>
          <AdminButton onClick={() => setCurrentAdminPage("playerStats")}>
            Update a player
          </AdminButton>
          <AdminButton onClick={() => setCurrentAdminPage("addPlayer")}>
            Add player
          </AdminButton>
          <AdminButton onClick={() => setCurrentAdminPage("removePlayer")}>
            Remove player
          </AdminButton>
          <AdminButton onClick={() => setCurrentAdminPage("addGame")}>
            Add game
          </AdminButton>
          <AdminButton onClick={() => setCurrentAdminPage("removeGame")}>
            Remove game
          </AdminButton>
          <AdminButton onClick={() => setCurrentAdminPage("updateGame")}>
            Live game manager
          </AdminButton>
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
  flex-direction: column;
`;
const AdminButton = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 24px;
`;
