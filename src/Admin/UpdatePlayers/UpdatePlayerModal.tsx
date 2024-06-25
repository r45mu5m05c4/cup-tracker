import { styled } from "styled-components";

import React, { useState } from "react";
import { updatePlayerStats } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Player, PlayerPosition } from "../../utils/types/Player";

interface Props {
  player: Player;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
const UpdatePlayerModal: React.FC<Props> = ({
  player,
  setShowModal,
}: Props) => {
  const [playerName, setPlayerName] = useState<string>(player.name);
  const [jerseyNumber, setJerseyNumber] = useState<number>(player.jerseyNumber);
  const [goals, setGoals] = useState<number>(player.goals);
  const [assists, setAssists] = useState<number>(player.assists);
  const [points, setPoints] = useState<number>(player.points);
  const [penaltyMinutes, setPenaltyMinutes] = useState<number>(
    player.penaltyMinutes
  );
  const [gamesPlayed, setGamesPlayed] = useState<number>(player.gamesPlayed);
  const [position, setPosition] = useState<PlayerPosition>(player.position);
  const [message, setMessage] = useState("");
  const { user } = useUser();

  const handleUpdatePlayer = () => {
    if (user?.accessToken) {
      const updatedPlayer: Player = {
        id: player.id,
        name: playerName,
        goals: goals,
        assists: assists,
        points: points,
        penaltyMinutes: penaltyMinutes,
        gamesPlayed: gamesPlayed,
        position: position,
        jerseyNumber: jerseyNumber,
        teamName: player.teamName,
      };
      updatePlayerStats(updatedPlayer, user?.accessToken);
      setMessage(`Successfully updated ${updatedPlayer.name}`);
      setTimeout(() => {
        setShowModal(false);
      }, 5000);
    }
  };

  const possiblePlayerPositions: PlayerPosition[] = [
    PlayerPosition.Center,
    PlayerPosition.Defense,
    PlayerPosition.Goalie,
    PlayerPosition.LeftWing,
    PlayerPosition.RightWing,
  ];
  return (
    <Modal>
      <Container>
        <h2>Update {player.name}</h2>

        {player && (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePlayer();
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </label>
              <br />
              <label>
                Goals:
                <input
                  type="number"
                  value={goals}
                  onChange={(e) => setGoals(parseInt(e.target.value))}
                />
              </label>
              <br />
              <label>
                Assists:
                <input
                  type="number"
                  value={assists}
                  onChange={(e) => setAssists(parseInt(e.target.value))}
                />
              </label>
              <br />
              <label>
                Points:
                <input
                  type="number"
                  value={goals + assists}
                  disabled
                  onChange={(e) => setPoints(parseInt(e.target.value))}
                />
              </label>
              <br />
              <label>
                Penalty Minutes:
                <input
                  type="number"
                  value={penaltyMinutes}
                  onChange={(e) => setPenaltyMinutes(parseInt(e.target.value))}
                />
              </label>
              <br />
              <label>
                Games Played:
                <input
                  type="number"
                  value={gamesPlayed}
                  onChange={(e) => setGamesPlayed(parseInt(e.target.value))}
                />
              </label>
              <br />
              <label>
                Jersey Number:
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
                />
              </label>
              <br />
              <label>
                Position:
                <select
                  value={position}
                  onChange={(e) =>
                    setPosition(e.target.value as PlayerPosition)
                  }
                >
                  {possiblePlayerPositions.map((pos) => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
              </label>
              <br />
              <Button type="submit">Add Player</Button>
            </form>
          </div>
        )}
        {message !== "" && <span>{message}</span>}
      </Container>
    </Modal>
  );
};

export default UpdatePlayerModal;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;
const Modal = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
`;
const Button = styled.button`
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
  margin:auto;
`;