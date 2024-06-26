import { styled } from "styled-components";
import { Game } from "../../utils/types/Game";
import { getGames } from "../../utils/queries";
import { useEffect, useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import GameModal from "./GameModal";

const Games = () => {
  const [games, setGames] = useState<Game[]>();
  const [openGame, setOpenGame] = useState<Game>();
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken)
        try {
          const gamesFromAPI = await getGames(user.accessToken);
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

  const getDateString = (date: string) => {
    if (isYesterday(date))
      return `Yesterday ${format(new Date(date), "HH:mm")} `;
    if (isToday(date)) return `Today ${format(new Date(date), "HH:mm")} `;
    if (isTomorrow(date)) return `Tomorrow ${format(new Date(date), "HH:mm")} `;
    else return format(new Date(date), "HH:mm - dd MMMM");
  };
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
          <GameItem key={game._id} onClick={() => handleOpenGame(game._id)}>
            <TeamsContainer>
              <TeamName>{game.homeTeam}</TeamName>
              <TeamName>{game.awayTeam}</TeamName>
            </TeamsContainer>
            <GameDetails>
              <Score>{`${game.homeTeamGoals.length} - ${game.awayTeamGoals.length}`}</Score>
              <Time>{getDateString(game.startTime)}</Time>
            </GameDetails>
          </GameItem>
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
const GameItem = styled.div`
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 50%;
  background-color: #f8f9fa;
  border: 1px solid #007bff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TeamName = styled.span`
  font-weight: bold;
  color: #343a40;
`;

const Score = styled.span`
  padding: 0 10px;
  color: #28a745;
`;
const Time = styled.span`
  font-size: 14px;
  color: #343a40;
`;
const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
