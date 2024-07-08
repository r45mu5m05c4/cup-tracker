import { useEffect, useState } from "react";
import { Game } from "../../utils/types/Game";
import { useUser } from "../../utils/context/UserContext";
import { getGames, removeGameById } from "../../utils/queries";
import { styled } from "styled-components";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Typography } from "../../molecules/Typography";
import { Button } from "../../molecules/Button";

export const RemoveGame = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  const onRemoveGame = async (removeGame: Game) => {
    if (!user?.accessToken || !removeGame.gameId) return;
    setError(null);
    try {
      await refreshAccessToken();
      await removeGameById(
        user.accessToken,
        removeGame.gameId,
        removeGame.competition
      );
      setMessage("Removed game");
    } catch (error) {
      setError("Error removing game data. Please try again.");
      console.error("Error removing game:", error);
    }
  };

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const gamesFromAPI = await getGames(
            user.accessToken,
            competition.name
          );
          setGames(gamesFromAPI);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, [user]);

  return (
    <Container>
      {games.length > 0 ? (
        <>
          <Typography style={{ fontWeight: "500", marginBottom: "12px" }}>
            Games
          </Typography>
          <GameList>
            {games.map((g) => (
              <GameWrapper key={g.gameId}>
                <GameItem key={g._id}>
                  {g.awayTeam} @ {g.homeTeam}, {g.gameStage}, {g.gameType}
                </GameItem>
                <Button onClick={() => onRemoveGame(g)}>Remove game</Button>
              </GameWrapper>
            ))}
          </GameList>
        </>
      ) : (
        <Typography>No games yet.</Typography>
      )}
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const GameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GameWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GameItem = styled.div`
  display: flex;
  flex-direction: row;
`;
