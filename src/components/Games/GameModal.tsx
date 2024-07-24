import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { GameMetaData, Goal, Penalty } from "../../utils/types/Game";
import { getGameByIdWithMetaData, getPlayers } from "../../utils/queries";
import { GameTimer } from "../../molecules/GameTimer";
import { Player } from "../../utils/types/Player";

interface GameModalProps {
  game: GameMetaData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameModal = ({ setShowModal, game }: GameModalProps) => {
  const [activeGame, setActiveGame] = useState<GameMetaData>(game);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [homeGoals, setHomeGoals] = useState<Goal[]>([]);
  const [awayGoals, setAwayGoals] = useState<Goal[]>([]);
  const [homePenalties, setHomePenalties] = useState<Penalty[]>([]);
  const [awayPenalties, setAwayPenalties] = useState<Penalty[]>([]);

  const refetchGame = useCallback(async () => {
    if (!game.id) return;

    setLoading(true);
    setError(null);

    try {
      const gameFromAPI: GameMetaData = await getGameByIdWithMetaData(
        game.id,
        game.competitionId
      );
      setActiveGame(gameFromAPI);
      setLoading(false);
    } catch (error) {
      setError("Error fetching game data. Please try again.");
      console.error("Error fetching games:", error);
      setLoading(false);
    }
  }, [game.id, game.competitionId]);

  useEffect(() => {
    if (!activeGame) {
      refetchGame();
    }
  }, [refetchGame, activeGame]);
  useEffect(() => {
    const getAllPlayers = async () => {
      try {
        const playersFromAPI: Player[] = await getPlayers(game.competitionId);
        setPlayers(playersFromAPI);
        setLoading(false);
      } catch (error) {
        setError("Error fetching players data. Please try again.");
        console.error("Error fetching players:", error);
        setLoading(false);
      }
    };
    getAllPlayers();
    renderGoalsAndPenalties();
  }, []);
  const handleClose = () => {
    setShowModal(false);
  };
  const renderGoalsAndPenalties = () => {
    let homeGoalsArray: Goal[] = [];
    let awayGoalsArray: Goal[] = [];
    if (game) {
      game.goals.map((g: Goal) => {
        g.scoringTeamId === game.homeTeamId
          ? homeGoalsArray.push(g)
          : awayGoalsArray.push(g);
      });
    }
    setHomeGoals(homeGoalsArray);
    setAwayGoals(awayGoalsArray);

    let homePenatliesArray: Penalty[] = [];
    let awayPenatliesArray: Penalty[] = [];
    if (game) {
      game.penalties.map((p: Penalty) => {
        p.teamId === game.homeTeamId
          ? homePenatliesArray.push(p)
          : awayPenatliesArray.push(p);
      });
    }
    setHomePenalties(homePenatliesArray);
    setAwayPenalties(awayPenatliesArray);
  };
  const getPlayerName = (playerId: number) => {
    const player = players.find((p: Player) => playerId === p.id);
    if (player) return player.name;
  };
  const eventRenderer = () => {
    if (!activeGame) return null;
    const penalties = [...homePenalties, ...awayPenalties];
    const goals = [...homeGoals, ...awayGoals];

    const sortedPenalties = penalties.length
      ? penalties.map((p: Penalty) => ({
          type: "penalty",
          home: p.teamId === game.homeTeamId,
          ...p,
        }))
      : [];
    const sortedGoals =
      goals &&
      goals.map((g: Goal) => ({
        type: "goal",
        home: g.scoringTeamId === game.homeTeamId,
        ...g,
      }));

    const allEvents = [...sortedPenalties, ...sortedGoals];
    allEvents.sort((a, b) => a.gameMinute - b.gameMinute);
    const isGoal = (event: Goal | Penalty): event is Goal => {
      return (event as Goal).scorerId !== undefined;
    };
    const isPenalty = (event: Goal | Penalty): event is Penalty => {
      return (event as Penalty).playerId !== undefined;
    };
    const eventItems = allEvents.map((event, index) => {
      if (isGoal(event))
        return (
          <EventsRow key={index} home={event.home}>
            <>
              <GoalHeader>
                {event.gameMinute}' GOAL by {getPlayerName(event.scorerId)}
              </GoalHeader>
              <EventText>
                {event.primaryAssisterId
                  ? `Assisted by: ${getPlayerName(event.primaryAssisterId)}`
                  : "Unassisted"}
                {event.secondaryAssisterId &&
                  `, ${getPlayerName(event.secondaryAssisterId)}`}
              </EventText>
            </>
          </EventsRow>
        );
      else if (isPenalty(event))
        return (
          <EventsRow key={index} home={event.home}>
            <EventHeader>
              {event.gameMinute}' Penalty for {getPlayerName(event.playerId)}
            </EventHeader>
            <EventText>
              {event.penaltyMinutes} minutes, {event.penaltyType}
            </EventText>
          </EventsRow>
        );
    });
    return eventItems;
  };

  return (
    <>
      <Overlay onClick={handleClose} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <LiveGame>
          <Header>{`${game.awayTeam.name} @ ${game.homeTeam.name}`}</Header>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <GoalsRow>
            <AwayGoals>{awayGoals.length}</AwayGoals>
            <GameTimeContainer>
              <GameTimer
                startTime={new Date(game.startTime)}
                ended={game.ended}
              />
            </GameTimeContainer>
            <HomeGoals>{homeGoals.length}</HomeGoals>
          </GoalsRow>
          <GoalsRow>
            <AwayShots>{activeGame?.awayTeamShots}</AwayShots>shots
            <HomeShots>{activeGame?.homeTeamShots}</HomeShots>
          </GoalsRow>
          {eventRenderer()}
        </LiveGame>
        <Button onClick={refetchGame} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button onClick={handleClose}>Close</Button>
      </Modal>
    </>
  );
};
const HomeShots = styled.p`
  width: 45%;
  margin-right: 5%;
  margin-left: auto;
  text-align: right;
`;
const AwayShots = styled.p`
  width: 45%;
  margin-left: 5%;
  margin-right: auto;
  text-align: left;
`;
const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  color: #fff;
  cursor: pointer;
  transition: border-color 0.25s;
  margin: 24px;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GameTimeContainer = styled.div`
  margin: auto;
`;

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
`;

const Modal = styled.div`
  top: 5%;
  left: 25%;
  width: 50%;
  z-index: 100;
  position: absolute;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: var(--neutral-surface-base);
  border: none;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    top: 0;
    left: 0;
    width: 90%;
  }
`;

const LiveGame = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const Header = styled.h2`
  margin: auto;
`;

const GoalsRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const HomeGoals = styled.h1`
  width: 45%;
  margin-right: 5%;
  margin-left: auto;
  text-align: right;
`;

const AwayGoals = styled.h1`
  width: 45%;
  margin-right: auto;
  margin-left: 5%;
`;

const EventsRow = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "home",
})<{ home: boolean }>`
  text-align: ${(props) => (props.home ? "right" : "left")};
  border-top: 1px solid;
  margin: 0;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1em;
  margin: 16px 0;
`;

const EventText = styled.p`
  margin: 0;
  font-size: 0.8rem;
`;

const EventHeader = styled.p`
  margin: 0;
  font-weight: 500;
`;

const GoalHeader = styled.p`
  margin: 0;
  font-weight: bold;
`;
