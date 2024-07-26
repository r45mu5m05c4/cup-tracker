import { styled } from "styled-components";
import { useState } from "react";
import { addTeam } from "../../utils/queries";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Typography } from "../../molecules/Typography";
import { Button } from "../../molecules/Button";
import { Select } from "../../molecules/Select";
import { AddLogo } from "../AddLogo";

export type NewTeam = {
  name: string;
  draws: number;
  overTimeLosses: number;
  losses: number;
  competitionId: number;
  wins: number;
  group: string;
  playoffGroup: string;
  logo: string | undefined;
};
interface AddTeamModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AddTeamModal = ({ setShowModal }: AddTeamModalProps) => {
  const [teamName, setTeamName] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [group, setGroup] = useState<string>("");
  const [playoffGroup, setPlayoffGroup] = useState<string>("");

  const [message, setMessage] = useState("");
  const { competition } = useCompetition();

  const handleAddTeam = async () => {
    console.log(logoUrl);
    if (competition) {
      const newTeam: NewTeam = {
        name: teamName,
        wins: 0,
        draws: 0,
        losses: 0,
        overTimeLosses: 0,
        group: group,
        playoffGroup: playoffGroup,
        competitionId: competition.id,
        logo: logoUrl,
      };

      try {
        await addTeam(newTeam);
        setMessage(`Successfully added ${newTeam.name}`);
      } catch (e) {
        console.log(e);
        setMessage("Could not update team");
      }
    }
  };

  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        {competition && (
          <div>
            <Typography style={{ fontWeight: "600", marginTop: "12px" }}>
              Add team to: {competition.name}
            </Typography>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTeam();
              }}
            >
              <Label>
                Name
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </Label>
              <Label>
                Logo
                <AddLogo setLogoUrl={setLogoUrl} />
              </Label>
              <Select
                label="Group"
                value={group}
                placeholder="Select group"
                options={[
                  { label: "Group A", value: "a" },
                  { label: "Group B", value: "b" },
                ]}
                onChange={(e) => setGroup(e.target.value)}
              />
              <Select
                label="Playoff group"
                value={playoffGroup}
                placeholder="Select group"
                options={[
                  { label: "Playoff group A", value: "a" },
                  { label: "Playoff group B", value: "b" },
                ]}
                onChange={(e) => setPlayoffGroup(e.target.value)}
              />
              <ButtonContainer>
                <Button type="submit" onClick={() => {}}>
                  Add Team
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
