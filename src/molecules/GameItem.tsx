import styled from "styled-components";
import {  GameMetaData, Goal } from "../utils/types/Game";
import { isBefore } from "date-fns";
import { GameTimer } from "./GameTimer";

interface GameItemProps {
  game: GameMetaData;
  handleOpenGame: (gameId: string | undefined) => void;
}

export const GameItem = ({ game, handleOpenGame }: GameItemProps) => {
  const $isActive = isBefore(game.startTime, new Date()) && !game.ended;

  const renderGoals = () => {
    let homeGoals = [];
    let awayGoals = [];
    if (game) {
      game.goals.map((g: Goal) => {
        g.scoringTeamId === game.homeTeamId
          ? homeGoals.push(g)
          : awayGoals.push(g);
      });
    }
    return `${awayGoals.length} - ${homeGoals.length}`;
  };
  return (
    <GameItemCard key={game.id} onClick={() => handleOpenGame(game.id)}>
      <TeamsContainer>
        <TeamName>{game.awayTeam.name}</TeamName>
        <TeamName>{game.homeTeam.name}</TeamName>
      </TeamsContainer>
      <GameDetails>
        <Score $isActive={$isActive}>{renderGoals()}</Score>
        {game.ended ? (
          <Time>Final</Time>
        ) : (
          <Time>
            <GameTimer
              startTime={new Date(game.startTime)}
              ended={game.ended}
            />
          </Time>
        )}
      </GameDetails>
    </GameItemCard>
  );
};

const GameItemCard = styled.div`
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  width: 50%;
  min-width: 220px;
  background-color: var(--decorative-brand-light);
  border: 1px solid var(--decorative-brand-light);
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

const Score = styled.span<{ $isActive: boolean }>`
  padding: 0 10px;
  color: ${(props) => (props.$isActive ? "#28a745" : "#343a40")};
`;

const Time = styled.span`
  font-size: 14px;
  color: #343a40;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 64px;
`;

const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
