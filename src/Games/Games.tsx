import { styled } from "styled-components";
import { MOCK_GAMES } from "../utils/MOCK_DATA";

const Games = () => {
  const allGames = MOCK_GAMES;
  return (
    <Container>
      {allGames.map((game) => {
        return (
          <GameItem>
            <TeamsContainer>
              <TeamName>{game.homeTeam}</TeamName>
              <TeamName>{game.awayTeam}</TeamName>
            </TeamsContainer>
            <GameDetails>
              <Score>{`${game.homeTeamGoals} - ${game.awayTeamGoals}`}</Score>
              <Time>{game.startTime}</Time>
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
  background-color: #f0f0f0;
  border: 1px solid #ccc;
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
`;

const Score = styled.span`
  padding: 0 10px;
  font-size: 18px;
`;
const Time = styled.span`
  font-size: 14px;
  color: #666;
`;
const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
