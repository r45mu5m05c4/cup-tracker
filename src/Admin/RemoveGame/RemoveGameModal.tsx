import styled from "styled-components";
import { FC, useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import { Game } from "../../utils/types/Game";
import { removeGameById } from "../../utils/queries";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  game: Game;
}

const RemoveGameModal: FC<Props> = ({ setShowModal, game }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useUser();

  const removeGame = async () => {
    console.log("Fetching game with ID:", game.gameId);
    console.log(game.gameId);
    if (!user?.accessToken || !game.gameId) return;

    setLoading(true);
    setError(null);

    try {
      const gameFromAPI = await removeGameById(
        user.accessToken,
        game.gameId,
        game.competition
      );
      console.log("Removed:", gameFromAPI);
      setMessage("Removed game");
      setLoading(false);
    } catch (error) {
      setError("Error removing game data. Please try again.");
      console.error("Error removing game:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Overlay onClick={handleClose} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>{`Removing ${game.awayTeam} @ ${game.homeTeam}`}</Header>
        <Info>
          {loading && <p>"Loading..."</p>}
          {error && <ErrorMessage>{error}</ErrorMessage>}{" "}
          {message ? (
            <SuccessMessage>{message}</SuccessMessage>
          ) : (
            "Are you sure you want to remove this game?"
          )}
          <br />
          <b>
            {`${game.awayTeam} @ ${game.homeTeam}`}
            {`, ${game.gameType}, ${game.gameStage}`}
          </b>
        </Info>

        <Button onClick={removeGame} disabled={loading}>
          {loading ? "Removing..." : "Remove"}
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </Modal>
    </>
  );
};

export default RemoveGameModal;

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
  margin: 24px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
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
  background-color: #fff;
  @media (max-width: 768px) {
    top: 0;
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
