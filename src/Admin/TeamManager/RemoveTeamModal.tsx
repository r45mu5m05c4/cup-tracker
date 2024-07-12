import styled from "styled-components";
import { useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import { removeTeamById } from "../../utils/queries";
import { Team } from "../../utils/types/Team";
import { Button } from "../../molecules/Button";

interface RemoveTeamModalProps {
  team: Team;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const RemoveTeamModal = ({ team, setShowModal }: RemoveTeamModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user, refreshAccessToken } = useUser();

  const removeTeam = async () => {
    if (!user?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      await refreshAccessToken();
      await removeTeamById(user.accessToken, team._id, team.competition);
      setMessage("Removed team");
      setLoading(false);
    } catch (error) {
      setError("Error removing team data. Please try again.");
      console.error("Error removing team:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Overlay onClick={handleClose} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>{`Removing ${team.name} `}</Header>
        <Info>
          {loading && <p>"Loading..."</p>}
          {error && <ErrorMessage>{error}</ErrorMessage>}{" "}
          {message ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            "Are you sure you want to remove this team?"
          )}
          <br />
          <b>{`${team.name} `}</b>
        </Info>
        <ButtonContainer>
          <Button onClick={removeTeam} disabled={loading}>
            {loading ? "Removing..." : "Remove"}
          </Button>
          <Button onClick={handleClose}>Close</Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};
export default RemoveTeamModal;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1em;
  margin: 16px 0;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 1em;
  margin: 16px 0;
`;

const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  gap: 24px;
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
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--neutral-surface-contrast);
  @media (max-width: 768px) {
    top: 10%;
    left: 0;
    width: 90%;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  padding: 24px;
`;

const Header = styled.h2`
  margin: auto;
`;
