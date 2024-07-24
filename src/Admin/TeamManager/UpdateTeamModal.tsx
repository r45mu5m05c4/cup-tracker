import { styled } from "styled-components";
import { useState } from "react";
import { Team } from "../../utils/types/Team";
import { updateTeamStats } from "../../utils/queries";
import { Select } from "../../molecules/Select";
import { Button } from "../../molecules/Button";
import { Typography } from "../../molecules/Typography";

interface UpdateTeamModalProps {
  team: Team;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UpdateTeamModal = ({
  team,
  setShowModal,
}: UpdateTeamModalProps) => {
  const [updatedWins, setUpdatedWins] = useState<number>(0);
  const [updatedDraws, setUpdatedDraws] = useState<number>(0);
  const [updatedLosses, setUpdatedLosses] = useState<number>(0);
  const [updatedOvertimeLosses, setUpdatedOvertimeLosses] = useState<number>(0);
  const [updatedPoints, setUpdatedPoints] = useState<number>(0);
  const [updatedGoals, setUpdatedGoals] = useState<number>(0);
  const [updatedGoalsAgainst, setUpdatedGoalsAgainst] = useState<number>(0);
  const [updatedGamesPlayed, setUpdatedGamesPlayed] = useState<number>(0);
  const [updatedGroup, setUpdatedGroup] = useState<string>("");
  const [updatedPlayoffGroup, setUpdatedPlayoffGroup] = useState<string>("");
  const [message, setMessage] = useState("");

  const handleUpdateTeam = () => {
    if (team) {
      const updatedTeam: Team = {
        ...team,
        wins: updatedWins,
        draws: updatedDraws,
        losses: updatedLosses,
        overtimeLosses: updatedOvertimeLosses,
        points: updatedPoints,
        goals: updatedGoals,
        goalsAgainst: updatedGoalsAgainst,
        gamesPlayed: updatedGamesPlayed,
        group: updatedGroup,
        playoffGroup: updatedPlayoffGroup,
      };
      try {
        updateTeamStats(updatedTeam);
        setMessage(`Successfully updated ${team.name}`);
      } catch (e) {
        setMessage("Update failed");
      }
    }
  };

  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal>
        <Container>
          {team && (
            <div>
              <Typography
                style={{ fontWeight: "600", margin: "32px 0 24px 0" }}
              >
                Updating team: {team.name}
              </Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateTeam();
                }}
              >
                <Label>
                  Wins
                  <input
                    type="number"
                    value={updatedWins}
                    onChange={(e) => setUpdatedWins(parseInt(e.target.value))}
                  />
                </Label>
                <Label>
                  Draws
                  <input
                    type="number"
                    value={updatedDraws}
                    onChange={(e) => setUpdatedDraws(parseInt(e.target.value))}
                  />
                </Label>
                <Label>
                  Losses
                  <input
                    type="number"
                    value={updatedLosses}
                    onChange={(e) => setUpdatedLosses(parseInt(e.target.value))}
                  />
                </Label>
                <Label>
                  Overtime Losses
                  <input
                    type="number"
                    value={updatedOvertimeLosses}
                    onChange={(e) =>
                      setUpdatedOvertimeLosses(parseInt(e.target.value))
                    }
                  />
                </Label>
                <Label>
                  Points
                  <input
                    type="number"
                    value={updatedPoints}
                    onChange={(e) => setUpdatedPoints(parseInt(e.target.value))}
                  />
                </Label>
                <Label>
                  Goals:
                  <input
                    type="number"
                    value={updatedGoals}
                    onChange={(e) => setUpdatedGoals(parseInt(e.target.value))}
                  />
                </Label>
                <Label>
                  Goals against:
                  <input
                    type="number"
                    value={updatedGoalsAgainst}
                    onChange={(e) =>
                      setUpdatedGoalsAgainst(parseInt(e.target.value))
                    }
                  />
                </Label>
                <Label>
                  Games played:
                  <input
                    type="number"
                    value={updatedGamesPlayed}
                    onChange={(e) =>
                      setUpdatedGamesPlayed(parseInt(e.target.value))
                    }
                  />
                </Label>
                <Select
                  label="Group"
                  value={updatedGroup}
                  placeholder="Select group"
                  options={[
                    { label: "Group A", value: "a" },
                    { label: "Group B", value: "b" },
                  ]}
                  onChange={(e) => setUpdatedGroup(e.target.value)}
                />
                <Select
                  label="Playoff group"
                  value={updatedPlayoffGroup}
                  placeholder="Select group"
                  options={[
                    { label: "Playoff group A", value: "a" },
                    { label: "Playoff group B", value: "b" },
                  ]}
                  onChange={(e) => setUpdatedPlayoffGroup(e.target.value)}
                />
                <ButtonContainer>
                  <Button type="submit" onClick={() => {}}>
                    Update Team
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
    </>
  );
};
const ButtonContainer = styled.div`
  margin: auto;
  margin-top: 24px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: 24px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
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
    left: 0;
    width: 90%;
    top: 10%;
  }
`;
const Label = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  font-size: 1em;
  font-weight: 500;
  gap: 14px;

  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
