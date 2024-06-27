import { styled } from "styled-components";
import { Game } from "../utils/types/Game";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import { FC } from "react";

interface Props {
  game: Game;
  handleOpenGame: (gameId: string | undefined) => void;
}

const GameItem: FC<Props> = ({ game, handleOpenGame }) => {
  const getDateString = (date: string) => {
    if (isYesterday(date))
      return `Yesterday ${format(new Date(date), "HH:mm")} `;
    if (isToday(date)) return `Today ${format(new Date(date), "HH:mm")} `;
    if (isTomorrow(date)) return `Tomorrow ${format(new Date(date), "HH:mm")} `;
    else return format(new Date(date), "HH:mm - dd MMMM");
  };

  return (
    <GameItemCard key={game._id} onClick={() => handleOpenGame(game._id)}>
      <TeamsContainer>
        <TeamName>{game.homeTeam}</TeamName>
        <TeamName>{game.awayTeam}</TeamName>
      </TeamsContainer>
      <GameDetails>
        <Score>{`${game.homeTeamGoals.length} - ${game.awayTeamGoals.length}`}</Score>
        <Time>{getDateString(game.startTime)}</Time>
      </GameDetails>
    </GameItemCard>
  );
};
export default GameItem;

const GameItemCard = styled.div`
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 50%;
  min-width: 220px;
  background-color: #f8f9fa;
  border: 1px solid #42917e;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 90%;
    min-width: 50px;
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
