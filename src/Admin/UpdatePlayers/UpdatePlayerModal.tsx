import { styled } from "styled-components";
import React, { useState } from "react";
import { updatePlayerStats } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Player, PlayerPosition } from "../../utils/types/Player";
import { Button } from "../../molecules/Button";
import { Select } from "../../molecules/Select";
import { Typography } from "../../molecules/Typography";

interface UpdatePlayerModalProps {
  player: Player;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UpdatePlayerModal = ({
  player,
  setShowModal,
}: UpdatePlayerModalProps) => {
  const [playerName, setPlayerName] = useState<string>(player.name);
  const [jerseyNumber, setJerseyNumber] = useState<number>(player.jerseyNumber);
  const [goals, setGoals] = useState<number>(player.goals);
  const [assists, setAssists] = useState<number>(player.assists);
  const [penaltyMinutes, setPenaltyMinutes] = useState<number>(
    player.penaltyMinutes
  );
  const [gamesPlayed, setGamesPlayed] = useState<number>(player.gamesPlayed);
  const [position, setPosition] = useState<PlayerPosition>(player.position);

  const [wins, setWins] = useState<number | undefined>(player.wins);
  const [saves, setSaves] = useState<number | undefined>(player.saves);
  const [goalsAgainst, setGoalsAgainst] = useState<number | undefined>(
    player.goalsAgainst
  );
  const [message, setMessage] = useState("");
  const { user } = useUser();

  const handleUpdatePlayer = () => {
    if (user?.accessToken) {
      const updatedPlayer: Player = {
        _id: player._id,
        generatedId: player.generatedId,
        name: playerName,
        goals: goals,
        assists: assists,
        points: goals + assists,
        penaltyMinutes: penaltyMinutes,
        gamesPlayed: gamesPlayed,
        position: position,
        jerseyNumber: jerseyNumber,
        teamName: player.teamName,
        competition: player.competition,
        wins: wins,
        saves: saves,
        goalsAgainst: goalsAgainst,
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
        <Typography variant="h3">Update {player.name}</Typography>

        {player && (
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdatePlayer();
              }}
            >
              <Label>
                Name:
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </Label>
              <br />
              <Label>
                Goals:
                <input
                  type="number"
                  value={goals}
                  onChange={(e) => setGoals(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <Label>
                Assists:
                <input
                  type="number"
                  value={assists}
                  onChange={(e) => setAssists(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <Label>
                Points: <p>{goals + assists}</p>
              </Label>
              <br />
              <Label>
                Penalty Minutes:
                <input
                  type="number"
                  value={penaltyMinutes}
                  onChange={(e) => setPenaltyMinutes(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <Label>
                Games Played:
                <input
                  type="number"
                  value={gamesPlayed}
                  onChange={(e) => setGamesPlayed(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <Label>
                Jersey Number:
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
                />
              </Label>
              <br />

              <Select
                label="Position"
                placeholder="Select a position"
                options={possiblePlayerPositions.map((position) => ({
                  value: position,
                  label: position,
                }))}
                onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              />
              <br />
              <Label>Goalie stats</Label>
              <br />
              <Label>
                Saves:
                <input
                  type="number"
                  value={saves}
                  onChange={(e) => setSaves(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <Label>
                Goals against:
                <input
                  type="number"
                  value={goalsAgainst}
                  onChange={(e) => setGoalsAgainst(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <Label>
                Wins:
                <input
                  type="number"
                  value={wins}
                  onChange={(e) => setWins(parseInt(e.target.value))}
                />
              </Label>
              <br />
              <ButtonContainer>
                <Button type="submit" onClick={() => {}}>
                  Update Player
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Close
                </Button>
              </ButtonContainer>
            </form>
          </div>
        )}
        {message !== "" && <span>{message}</span>}
      </Container>
    </Modal>
  );
};
const ButtonContainer = styled.div`
  margin: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
`;
const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Label = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: auto;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;

const Modal = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: var(--neutral-surface-base);
  border: none;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;
