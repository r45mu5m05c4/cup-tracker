import styled from "styled-components";
import { FC, useState } from "react";
import { useUser } from "../../utils/context/UserContext";
import { Game, Goal, Penalty } from "../../utils/types/Game";
import { getGameById } from "../../utils/queries";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  game: Game;
}

const GameModal: FC<Props> = ({ setShowModal, game }) => {
  const [activeGame, setActiveGame] = useState<Game | null>(game);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const refetchGame = async () => {
    console.log(game.gameId);
    if (!user?.accessToken || !game.gameId) return;

    setLoading(true);
    setError(null);

    try {
      const gameFromAPI = await getGameById(user.accessToken, game.gameId);
      setActiveGame(gameFromAPI);
    } catch (error) {
      setError("Error fetching game data. Please try again.");
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };
  const eventRenderer = () => {
    const penalties = game.penalty?.length
      ? game.penalty.map((p) => ({
          type: "penalty",
          home: p.team === game.homeTeam,
          ...p,
        }))
      : [];
    const homeGoals =
      game.homeTeamGoals &&
      game.homeTeamGoals.map((g) => ({
        type: "goal",
        home: true,
        ...g,
      }));
    const awayGoals =
      game.awayTeamGoals &&
      game.awayTeamGoals.map((g) => ({
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
              <h3>
                {event.gameMinute}' GOAL by {event.scorer}
              </h3>
              <EventText>
                Assisted by: {event.primaryAssist}, {event.secondaryAssist}
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
          <Header>
            {activeGame
              ? `${activeGame.awayTeam} @ ${activeGame.homeTeam}`
              : "Loading..."}
          </Header>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <GoalsRow>
            <AwayGoals>{activeGame?.awayTeamGoals.length}</AwayGoals>
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

export default GameModal;

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

const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
`;

const Modal = styled.div`
  z-index: 100;
  position: absolute;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  @media (max-width: 768px) {
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
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
  width: 50%;
  margin-right: 5%;
  margin-left: auto;
  text-align: right;
`;

const AwayGoals = styled.h1`
  width: 50%;
  margin-right: auto;
  margin-left: 5%;
`;

const EventsRow = styled.p.withConfig({
  shouldForwardProp: (prop) => prop !== "home",
})<{ home: boolean }>`
  text-align: ${(props) => (props.home ? "right" : "left")};
  border-top: 1px solid;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 1em;
  margin: 16px 0;
`;
const EventText = styled.p``;
const EventHeader = styled.p`
  font-weight: bold;
`;
