import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { addPlayer, getTeams } from "../../utils/queries";
import { PlayerPosition } from "../../utils/types/Player";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Typography } from "../../molecules/Typography";
import { Button } from "../../molecules/Button";
import { Select } from "../../molecules/Select";

export type NewPlayer = {
  name: string;
  gamesPlayed: number;
  position: PlayerPosition;
  jerseyNumber: number;
  teamId: number;
  competitionId: number;
  wins?: number;
  saves?: number;
  goalsAgainst?: number;
};
interface AddPlayerModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AddPlayerModal = ({ setShowModal }: AddPlayerModalProps) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [jerseyNumber, setJerseyNumber] = useState<number>(0);
  const [position, setPosition] = useState<PlayerPosition>(
    PlayerPosition.Center
  );
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (competition)
        try {
          const teamsFromAPI = await getTeams(competition.id);
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllTeams();
  }, []);

  const handleTeamSelect = (teamId: number) => {
    const foundTeam = teams.find((team) => team.id === teamId);
    if (foundTeam) {
      setSelectedTeam(foundTeam);
    }
  };

  const handleAddPlayer = async () => {
    if (competition) {
      if (selectedTeam && position) {
        const newPlayer: NewPlayer =
          position === "G"
            ? {
                name: playerName,
                gamesPlayed: 0,
                position: position,
                jerseyNumber: jerseyNumber,
                teamId: selectedTeam.id,
                competitionId: competition.id,
                wins: 0,
                saves: 0,
                goalsAgainst: 0,
              }
            : {
                name: playerName,
                gamesPlayed: 0,
                position: position,
                jerseyNumber: jerseyNumber,
                teamId: selectedTeam.id,
                competitionId: competition.id,
              };

        try {
          await addPlayer(newPlayer);
          setMessage(`Successfully added ${newPlayer.name}`);
        } catch (e) {
          console.log(e);
          setMessage("Could not update player");
        }
      }
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
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <Select
          label="Select a team to add a player to"
          placeholder="Select a team"
          options={teams.map((team) => ({
            value: team.id.toString(),
            label: team.name,
          }))}
          onChange={(e) => handleTeamSelect(parseInt(e.target.value))}
        />
        {selectedTeam && (
          <div>
            <Typography style={{ fontWeight: "600", marginTop: "12px" }}>
              Add player to: {selectedTeam.name}{" "}
            </Typography>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlayer();
              }}
            >
              <Label>
                Name
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </Label>
              <Label>
                Jersey Number
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(parseInt(e.target.value))}
                />
              </Label>

              <Select
                label="Position"
                value={position}
                placeholder="Select position"
                options={possiblePlayerPositions.map((position) => ({
                  value: position,
                  label: position,
                }))}
                onChange={(e) => setPosition(e.target.value as PlayerPosition)}
              />

              <ButtonContainer>
                <Button type="submit" onClick={() => {}}>
                  Add Player
                </Button>
                <Button onClick={() => setShowModal(false)}>Close</Button>
              </ButtonContainer>
            </form>
          </div>
        )}
        {message !== "" && <span>{message}</span>}
      </Modal>
    </>
  );
};
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  gap: 24px;
`;
const Modal = styled.div`
  top: 5%;
  left: 25%;
  width: 50%;
  z-index: 100;
  position: absolute;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--neutral-surface-contrast);
  @media (max-width: 768px) {
    top: 10%;
    left: 0;
    width: 90%;
  }
`;
const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
  @media (max-width: 768px) {
    opacity: 100%;
  }
`;
const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 24px 0 8px 0px;

  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
