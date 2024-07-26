import { styled } from "styled-components";
import { GameMetaData } from "../../utils/types/Game";
import { getGames } from "../../utils/queries";
import { useEffect, useState } from "react";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { GameItem } from "../../molecules/GameItem";
import { GameModal } from "./GameModal";

export const Games = () => {
  const [games, setGames] = useState<GameMetaData[]>();
  const [openGame, setOpenGame] = useState<GameMetaData>();
  const [showModal, setShowModal] = useState(false);
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllGames = async () => {
      if (competition)
        try {
          const gamesFromAPI = await getGames(competition.id);
          const sortedGames: GameMetaData[] = gamesFromAPI.sort(
            (a: GameMetaData, b: GameMetaData) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
          setGames(sortedGames);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, []);

  const handleOpenGame = (gameId: number | undefined) => {
    const foundGame = gameId && games?.find((g) => g.id === gameId);
    if (foundGame) {
      setOpenGame(foundGame);
      setShowModal(true);
    }
  };
  return (
    <Container>
      {games?.length ? (
        games.map((game: GameMetaData) => {
          return (
            <GameItem
              key={game.id}
              game={game}
              handleOpenGame={() => handleOpenGame(game.id)}
            />
          );
        })
      ) : (
        <NoGamesText>No games scheduled</NoGamesText>
      )}
      {openGame && showModal && (
        <GameModal setShowModal={setShowModal} game={openGame} />
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    padding: 0;
    padding-bottom: 50px;
    min-height: 500px;
  }
`;

const NoGamesText = styled.h2`
  margin: auto;
  padding: 24px;
`;
