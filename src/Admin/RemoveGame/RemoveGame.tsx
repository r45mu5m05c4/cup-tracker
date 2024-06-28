import { useEffect, useState } from "react";
import { Game } from "../../utils/types/Game";
import { useUser } from "../../utils/context/UserContext";
import { getGames } from "../../utils/queries";
import { styled } from "styled-components";
import RemoveGameModal from "./RemoveGameModal";

const RemoveGame = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game>();
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useUser();

  const gamePicker = (gameId: string) => {
    const foundGame = games && games.find((g) => g.gameId === gameId);
    foundGame && setGame(foundGame);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken)
        try {
          const gamesFromAPI = await getGames(user.accessToken);
          setGames(gamesFromAPI);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, [user]);

  return (
    <Container>
      {games.length > 0 && (
        <Label>
          Select game to remove:
          <GameList>
            {games.map((g) => (
              <GameItem key={g._id} onClick={() => gamePicker(g.gameId)}>
                {g.awayTeam} @ {g.homeTeam}, {g.gameStage}, {g.gameType}
              </GameItem>
            ))}
          </GameList>
        </Label>
      )}
      {game && modalOpen && (
        <RemoveGameModal game={game} setShowModal={setModalOpen} />
      )}
    </Container>
  );
};

export default RemoveGame;

const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const GameList = styled.div`
  margin: auto;
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const GameItem = styled.div`
  margin: auto;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  border: 1px solid;
  cursor: pointer;
`;

const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 5px;
  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
