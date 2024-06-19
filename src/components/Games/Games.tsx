import { styled } from "styled-components";
import { MOCK_GAMES } from "../../utils/MOCK_DATA";

interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeTeamGoals: number;
  awayTeamGoals: number;
}

const Games = () => {
  const allGames: Game[] = MOCK_GAMES;
  const sortedGames: Game[] = allGames.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
  
  return (
    <Container>
      {sortedGames.map((game: Game) => {
        return (
          <GameItem key={game.id}>
            <TeamsContainer>
              <TeamName>{game.homeTeam}</TeamName>
              <TeamName>{game.awayTeam}</TeamName>
            </TeamsContainer>
            <GameDetails>
              <Score>{`${game.homeTeamGoals} - ${game.awayTeamGoals}`}</Score>
              <Time>{new Date(game.startTime).toLocaleString()}</Time>
            </GameDetails>
          </GameItem>
        );
      })}
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
