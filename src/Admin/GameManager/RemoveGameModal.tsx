import { useState } from "react";
import { Game } from "../../utils/types/Game";
import { useUser } from "../../utils/context/UserContext";
import { removeGameById } from "../../utils/queries";
import { styled } from "styled-components";
import { Button } from "../../molecules/Button";
import { format } from "date-fns";

interface RemoveGameModalProps {
  game: Game;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RemoveGameModal = ({
  game,
  setShowModal,
}: RemoveGameModalProps) => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user, refreshAccessToken } = useUser();

  const onRemoveGame = async () => {
    if (!user?.accessToken) return;
    setError(null);
    try {
      await refreshAccessToken();
      await removeGameById(user.accessToken, game.gameId, game.competition);
      setMessage("Removed game");
    } catch (error) {
      setError("Error removing game data. Please try again.");
      console.error("Error removing game:", error);
    }
  };

  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>{`Removing ${game.awayTeam} @ ${game.homeTeam}`}</Header>

        <GameCard key={game._id}>
          <GameCell>
            {game.awayTeam} @ {game.homeTeam}
          </GameCell>
          <GameCell>
            {game.gameStage}, {game.gameType}
          </GameCell>
          <GameCell>{format(game.startTime, "HH:mm - dd MMMM")}</GameCell>
        </GameCard>
        <ButtonContainer>
          <Button onClick={() => onRemoveGame()}>Remove</Button>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </ButtonContainer>
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
      </Modal>
    </>
  );
};

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
const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`;

const Header = styled.h2`
  margin: auto;
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

const GameCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: left;
  border: 1px solid;
  margin-top: 5px;
  padding: 10px;
  width: 100%;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
    border: none;
  }
`;
const GameCell = styled.p`
  margin: auto;
  margin-left: 10px;
`;
