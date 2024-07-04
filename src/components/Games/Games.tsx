import { styled } from "styled-components";
import { Game } from "../../utils/types/Game";
import { getGames } from "../../utils/queries";
import { useEffect, useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import GameModal from "./GameModal";
import GameItem from "../../molecules/GameItem";
import { useCompetition } from "../../utils/context/CompetitionContext";

const Games = () => {
  const [games, setGames] = useState<Game[]>();
  const [openGame, setOpenGame] = useState<Game>();
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken && competition)
        try {
          const gamesFromAPI = await getGames(
            user.accessToken,
            competition.name
          );
          const sortedGames: Game[] = gamesFromAPI.sort(
            (a: Game, b: Game) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
          setGames(sortedGames);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, []);

  const handleOpenGame = (gameId: string | undefined) => {
    const foundGame = gameId && games?.find((g) => g._id === gameId);
    if (foundGame) {
      setOpenGame(foundGame);
      setShowModal(true);
    }
  };
  return (
    <Container>
      {games?.map((game: Game) => {
        return (
          <GameItem
            key={game._id}
            game={game}
            handleOpenGame={handleOpenGame}
          />
        );
      })}
      {openGame && showModal && (
        <GameModal setShowModal={setShowModal} game={openGame} />
      )}
    </Container>
  );
};
export default Games;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
