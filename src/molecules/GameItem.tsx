import { keyframes, styled } from "styled-components";
import { Game } from "../utils/types/Game";
import { format, isToday, isTomorrow, isYesterday, isBefore } from "date-fns";
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
  const $isActive = isBefore(game.startTime, new Date()) && !game.ended;

  return (
    <GameItemCard key={game._id} onClick={() => handleOpenGame(game._id)}>
      <TeamsContainer>
        <TeamName>{game.homeTeam}</TeamName>

        <TeamName>{game.awayTeam}</TeamName>
      </TeamsContainer>
      <GameDetails>
        <Score
          $isActive={$isActive}
        >{`${game.homeTeamGoals.length} - ${game.awayTeamGoals.length}`}</Score>
        {game.ended ? (
          <Time>Final</Time>
        ) : (
          <Time>
            {$isActive ? <LiveCircle /> : getDateString(game.startTime)}
          </Time>
        )}
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
const blinkingAnimation = keyframes` 
50%   {
  transform: scale(2);
  opacity: 0
}
100%   {
  transform: scale(2);
  opacity: 0

}`;

const LiveCircle = styled.div`
  margin: 15px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #343a40;
  position: relative;

  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #00ff00;
    animation: ${blinkingAnimation} 2s infinite;
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

const Score = styled.span<{ $isActive: boolean }>`
  padding: 0 10px;
  color: ${(props) => (props.$isActive ? "#28a745" : "#343a40")};
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
