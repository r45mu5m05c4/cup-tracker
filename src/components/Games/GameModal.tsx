import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../utils/context/UserContext";
import { Game, Goal, Penalty } from "../../utils/types/Game";
import { getGameById } from "../../utils/queries";
import { GameTimer } from "../../molecules/GameTimer";

interface GameModalProps {
  game: Game;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GameModal = ({ setShowModal, game }: GameModalProps) => {
  const [activeGame, setActiveGame] = useState<Game>(game);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, refreshAccessToken } = useUser();

  const refetchGame = useCallback(async () => {
    console.log("Fetching game with ID:", game.gameId);
    console.log(game.gameId);
    if (!user?.accessToken || !game.gameId) return;

    setLoading(true);
    setError(null);

    try {
      await refreshAccessToken();
      const gameFromAPI = await getGameById(
        user.accessToken,
        game.gameId,
        game.competition
      );
      console.log("Fetched game data:", gameFromAPI);
      setActiveGame(gameFromAPI);
      setLoading(false);
    } catch (error) {
      setError("Error fetching game data. Please try again.");
      console.error("Error fetching games:", error);
    }
  }, [game.gameId, user?.accessToken]);

  useEffect(() => {
    refetchGame();
  }, [refetchGame]);

  const handleClose = () => {
    setShowModal(false);
  };

  const eventRenderer = () => {
    if (!activeGame) return null;

    const penalties = activeGame.penalty?.length
      ? activeGame.penalty.map((p) => ({
          type: "penalty",
          home: p.team === activeGame.homeTeam,
          ...p,
        }))
      : [];
    const homeGoals =
      activeGame.homeTeamGoals &&
      activeGame.homeTeamGoals.map((g) => ({
        type: "goal",
        home: true,
        ...g,
      }));
    const awayGoals =
      activeGame.awayTeamGoals &&
      activeGame.awayTeamGoals.map((g) => ({
        type: "goal",
        home: false,
        ...g,
      }));
    const allEvents = [...penalties, ...homeGoals, ...awayGoals];
    allEvents.sort((a, b) => a.gameMinute - b.gameMinute);
    const isGoal = (event: Goal | Penalty): event is Goal => {
      return (event as Goal).scorer !== undefined;
    };
    const isPenalty = (event: Goal | Penalty): event is Penalty => {
      return (event as Penalty).playerName !== undefined;
    };
    const eventItems = allEvents.map((event, index) => {
      if (isGoal(event))
        return (
          <EventsRow key={index} home={event.home}>
            <>
              <GoalHeader>
                {event.gameMinute}' GOAL by {event.scorer}
              </GoalHeader>
              <EventText>
                {event.primaryAssist !== "Unassisted"
                  ? `Assisted by: ${event.primaryAssist}`
                  : "Unassisted"}
                {event.secondaryAssist && `, ${event.secondaryAssist}`}
              </EventText>
            </>
          </EventsRow>
        );
      else if (isPenalty(event))
        return (
          <EventsRow key={index} home={event.home}>
            <EventHeader>
              {event.gameMinute}' Penalty for {event.playerName}
            </EventHeader>
            <EventText>
              {event.minutes} minutes, {event.penaltyType}
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
          <Header>{`${game.awayTeam} @ ${game.homeTeam}`}</Header>
          {loading && <p>"Loading..."</p>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <GoalsRow>
            <AwayGoals>{activeGame?.awayTeamGoals.length}</AwayGoals>
            <GameTimeContainer>
              <GameTimer
                startTime={new Date(game.startTime)}
                ended={game.ended}
              />
            </GameTimeContainer>
            <HomeGoals>{activeGame?.homeTeamGoals.length}</HomeGoals>
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

const EventsRow = styled.p.withConfig({
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
