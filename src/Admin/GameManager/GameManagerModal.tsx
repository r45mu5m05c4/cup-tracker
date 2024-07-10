import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { useUser } from "../../utils/context/UserContext";
import { Player } from "../../utils/types/Player";
import { Game, Penalty } from "../../utils/types/Game";
import {
  addShotToGame,
  getGameById,
  getPlayerByTeam,
  updateGoalieStatsAfterGame,
} from "../../utils/queries";
import { Goal } from "../../utils/types/Game";
import {
  addGoalToAwayTeamCurrentGame,
  addGoalToHomeTeamCurrentGame,
  addPenalty,
  addPenaltyToMatch,
  endMatch,
  giveDraw,
  giveLoss,
  giveWin,
} from "./helperFunctions";
import { addGoal } from "./addGoal";
import { GameTimer } from "../../molecules/GameTimer";
import { Typography } from "../../molecules/Typography";
import { Select } from "../../molecules/Select";
import { Button } from "../../molecules/Button";
interface GameManagerModalProps {
  pickedGame: Game;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const GameManagerModal = ({
  pickedGame,
  setShowModal,
}: GameManagerModalProps) => {
  const [game, setGame] = useState<Game>(pickedGame);
  const [homeGoalie, setHomeGoalie] = useState<string>("");
  const [awayGoalie, setAwayGoalie] = useState<string>("");
  const [homeShots, setHomeShots] = useState<number>(0);
  const [awayShots, setAwayShots] = useState<number>(0);
  const [homeEvent, setHomeEvent] = useState("");
  const [homePlayer, setHomePlayer] = useState<string>("");
  const [homeAssister, setHomeAssister] = useState<string | null>(null);
  const [homeSecondaryAssister, setHomeSecondaryAssister] = useState<
    string | null
  >(null);
  const [homePenaltyMinutes, setHomePenaltyMinutes] = useState<number | null>(
    null
  );
  const [homePenaltyType, setHomePenaltyType] = useState("");

  const [awayEvent, setAwayEvent] = useState("");
  const [awayPlayer, setAwayPlayer] = useState<string>("");
  const [awayAssister, setAwayAssister] = useState<string | null>(null);
  const [awaySecondaryAssister, setAwaySecondaryAssister] = useState<
    string | null
  >(null);
  const [awayPenaltyMinutes, setAwayPenaltyMinutes] = useState<number | null>(
    null
  );
  const [awayPenaltyType, setAwayPenaltyType] = useState("");

  const [gameMinute, setGameMinute] = useState<number>();
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [isOverTime, setIsOverTime] = useState<boolean>(false);
  const { user, refreshAccessToken } = useUser();

  const updateElapsedMinutes = () => {
    if (game) {
      const currentTime = new Date();
      const elapsedMilliseconds =
        currentTime.getTime() - new Date(game.startTime).getTime();
      const minutes = Math.floor(elapsedMilliseconds / (60 * 1000));
      minutes > 40 && setGameMinute(40);
      minutes < 0 && setGameMinute(0);
      minutes < 40 && minutes > 0 && setGameMinute(minutes);
    }
  };

  useEffect(() => {
    if (game) {
      getHomeTeamPlayers();
      getAwayTeamPlayers();
      updateElapsedMinutes();
    }
  }, [game]);

  const refetchGame = useCallback(async () => {
    if (!user?.accessToken || !game?.gameId) return;

    try {
      await refreshAccessToken();
      const gameFromAPI = await getGameById(
        user.accessToken,
        game.gameId,
        game.competition
      );
      setGame(gameFromAPI);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }, [game?.gameId, game?.competition, user?.accessToken, refreshAccessToken]);

  useEffect(() => {
    const addShot = async () => {
      if (game && user?.accessToken) {
        const updatedGame = {
          ...game,
          homeTeamShots: homeShots,
          awayTeamShots: awayShots,
        };
        await addShotToGame(updatedGame, user.accessToken);
      }
    };

    addShot();
  }, [homeShots, awayShots]);

  const getHomeTeamPlayers = async () => {
    if (game && user?.accessToken) {
      try {
        await refreshAccessToken();
        const playersInTeam = await getPlayerByTeam(
          game.homeTeam,
          user.accessToken,
          game.competition
        );
        setHomePlayers(playersInTeam);
      } catch (error) {
        console.error("Error fetching players in home team:", error);
      }
    }
  };

  const getAwayTeamPlayers = async () => {
    if (game && user?.accessToken) {
      try {
        await refreshAccessToken();
        const playersInTeam = await getPlayerByTeam(
          game.awayTeam,
          user.accessToken,
          game.competition
        );
        setAwayPlayers(playersInTeam);
      } catch (error) {
        console.error("Error fetching players in away team:", error);
      }
    }
  };

  const addHomeGoalHandler = async () => {
    if (homePlayer && game?.gameId && gameMinute && user?.accessToken) {
      const goal: Goal = {
        scorer: homePlayer,
        primaryAssist: homeAssister ? homeAssister : "Unassisted",
        secondaryAssist: homeSecondaryAssister ? homeSecondaryAssister : "",
        scoringTeamId: game.homeTeam,
        concedingTeamId: game.awayTeam,
        gameMinute: gameMinute,
      };
      await refreshAccessToken();
      await addGoal(goal, user.accessToken, game.competition);
      await addGoalToHomeTeamCurrentGame(
        game.gameId,
        goal,
        user.accessToken,
        game.competition
      );
      refetchGame();
    }
  };

  const addAwayGoalHandler = async () => {
    if (awayPlayer && game?.gameId && gameMinute && user?.accessToken) {
      const goal: Goal = {
        scorer: awayPlayer,
        primaryAssist: awayAssister ? awayAssister : "Unassisted",
        secondaryAssist: awaySecondaryAssister ? awaySecondaryAssister : "",
        scoringTeamId: game.awayTeam,
        concedingTeamId: game.homeTeam,
        gameMinute: gameMinute,
      };
      await refreshAccessToken();
      await addGoal(goal, user.accessToken, game.competition);

      await addGoalToAwayTeamCurrentGame(
        game.gameId,
        goal,
        user.accessToken,
        game.competition
      );
      refetchGame();
    }
  };
  const addHomePenaltyHandler = async () => {
    const foundHomePlayer = homePlayers.find(
      (p) => p.generatedId === homePlayer
    );
    if (
      homePlayer &&
      foundHomePlayer &&
      game?.gameId &&
      homePenaltyMinutes &&
      gameMinute &&
      user?.accessToken &&
      homePenaltyType
    ) {
      await refreshAccessToken();
      const penalty: Penalty = {
        playerId: homePlayer,
        playerName: foundHomePlayer.name,
        team: game.homeTeam,
        minutes: homePenaltyMinutes,
        gameMinute: gameMinute,
        penaltyType: homePenaltyType,
      };

      await addPenalty(
        homePenaltyMinutes,
        homePlayer,
        user.accessToken,
        game.competition
      );
      await addPenaltyToMatch(
        game?.gameId,
        penalty,
        user.accessToken,
        game.competition
      );
      refetchGame();
    }
  };

  const addAwayPenaltyHandler = async () => {
    const foundAwayPlayer = awayPlayers.find(
      (p) => p.generatedId === awayPlayer
    );
    if (
      awayPlayer &&
      foundAwayPlayer &&
      game?.gameId &&
      awayPenaltyMinutes &&
      gameMinute &&
      user?.accessToken &&
      awayPenaltyType
    ) {
      await refreshAccessToken();
      const penalty: Penalty = {
        playerId: awayPlayer,
        playerName: foundAwayPlayer.name,
        team: game.awayTeam,
        minutes: awayPenaltyMinutes,
        gameMinute: gameMinute,
        penaltyType: awayPenaltyType,
      };
      await addPenalty(
        awayPenaltyMinutes,
        awayPlayer,
        user.accessToken,
        game.competition
      );
      await addPenaltyToMatch(
        game?.gameId,
        penalty,
        user.accessToken,
        game.competition
      );
      refetchGame();
    }
  };
  const endMatchHandler = async () => {
    if (game && user?.accessToken) {
      game.ended = true;
      await refreshAccessToken();
      await endMatch(game, user.accessToken);
      if (game.awayTeamGoals.length === game.homeTeamGoals.length) {
        await giveDraw(game.awayTeam, user.accessToken, game.competition);
        await giveDraw(game.homeTeam, user.accessToken, game.competition);
      } else {
        const winner =
          game.awayTeamGoals.length > game.homeTeamGoals.length
            ? game.awayTeam
            : game.homeTeam;
        const loser =
          game.awayTeamGoals.length < game.homeTeamGoals.length
            ? game.awayTeam
            : game.homeTeam;
        await giveWin(winner, user.accessToken, game.competition);
        await giveLoss(loser, user.accessToken, game.competition, isOverTime);
      }
      if (homeGoalie && awayGoalie) {
        const awayWinner =
          game.awayTeamGoals.length > game.homeTeamGoals.length;
        const homeWinner =
          game.awayTeamGoals.length < game.homeTeamGoals.length;
        try {
          await updateGoalieStatsAfterGame(
            homeGoalie,
            homeWinner ? 1 : 0,
            game.awayTeamShots,
            game.awayTeamGoals.length,
            game.competition,
            user.accessToken
          );
          await updateGoalieStatsAfterGame(
            awayGoalie,
            awayWinner ? 1 : 0,
            game.homeTeamShots,
            game.homeTeamGoals.length,
            game.competition,
            user.accessToken
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
  const eventRenderer = () => {
    if (!game) return;
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
              <GoalHeader>
                {event.gameMinute}' GOAL by {event.scorer}
              </GoalHeader>
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
      {" "}
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        {game && (
          <LiveGame>
            <Header>
              {game.awayTeam} @ {game.homeTeam}
            </Header>
            <GoalsRow>
              <AwayGoals>{game.awayTeamGoals.length}</AwayGoals>
              <GameTimeContainer>
                <GameTimer
                  startTime={new Date(game.startTime)}
                  ended={game.ended}
                />
              </GameTimeContainer>
              <HomeGoals>{game.homeTeamGoals.length}</HomeGoals>
            </GoalsRow>
            {eventRenderer()}
          </LiveGame>
        )}

        <Container>
          {game && (
            <>
              <TeamContainer>
                <Typography variant="h3">Away</Typography>
                <Select
                  label="Away goalie"
                  value={awayGoalie}
                  placeholder="Select goalie"
                  options={awayPlayers
                    .filter((ap: Player) => ap.position === "G")
                    .map((player) => ({
                      value: player.generatedId,
                      label: `${player.jerseyNumber} - ${player.name}`,
                    }))}
                  onChange={(e) => setAwayGoalie(e.target.value)}
                />
                <div>
                  <Typography>Game minute</Typography>
                  <input
                    type="number"
                    value={gameMinute}
                    onChange={(e) => setGameMinute(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Typography>Shot counter</Typography>
                  <input
                    type="number"
                    value={awayShots}
                    onChange={(e) => setAwayShots(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Select
                    label="Event"
                    value={awayEvent}
                    placeholder="Select event"
                    options={[
                      { label: "Goal", value: "goal" },
                      { label: "Penalty", value: "pim" },
                    ]}
                    onChange={(e) => setAwayEvent(e.target.value)}
                  />
                </div>

                {awayEvent === "pim" ? (
                  <>
                    <Select
                      label="Player"
                      value={awayPlayer}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.generatedId,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setAwayPlayer(e.target.value)}
                    />
                    <div>
                      <Typography>Penalty minutes</Typography>
                      <input
                        type="number"
                        value={awayPenaltyMinutes || ""}
                        onChange={(e) =>
                          setAwayPenaltyMinutes(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Typography>Penalty type</Typography>
                      <input
                        type="text"
                        value={awayPenaltyType || ""}
                        onChange={(e) => setAwayPenaltyType(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Select
                      label="Scorer"
                      value={awayPlayer || ""}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.name,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setAwayPlayer(e.target.value)}
                    />
                    <Select
                      label="Primary assist"
                      value={awayAssister || ""}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.name,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setAwayAssister(e.target.value)}
                    />
                    <Select
                      label="Secondary assist"
                      value={awaySecondaryAssister || ""}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.name,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setAwaySecondaryAssister(e.target.value)}
                    />
                  </>
                )}
                {awayEvent === "goal" ? (
                  <Button onClick={() => addAwayGoalHandler()}>Add goal</Button>
                ) : (
                  <Button onClick={() => addAwayPenaltyHandler()}>
                    Add penalty
                  </Button>
                )}
              </TeamContainer>
              <TeamContainer>
                <Typography variant="h3">Home</Typography>
                <Select
                  label="Home goalie"
                  value={homeGoalie}
                  placeholder="Select goalie"
                  options={homePlayers
                    .filter((hp: Player) => hp.position === "G")
                    .map((player) => ({
                      value: player.generatedId,
                      label: `${player.jerseyNumber} - ${player.name}`,
                    }))}
                  onChange={(e) => setHomeGoalie(e.target.value)}
                />
                <div>
                  <Typography>Game minute</Typography>
                  <input
                    type="number"
                    value={gameMinute}
                    onChange={(e) => setGameMinute(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Typography>Shot counter</Typography>
                  <input
                    type="number"
                    value={homeShots}
                    onChange={(e) => setHomeShots(parseInt(e.target.value))}
                  />
                </div>
                <Select
                  label="Event"
                  value={homeEvent || ""}
                  placeholder="Select event"
                  options={[
                    { label: "Goal", value: "goal" },
                    { label: "Penalty", value: "pim" },
                  ]}
                  onChange={(e) => setHomeEvent(e.target.value)}
                />
                {homeEvent !== "" && homeEvent === "pim" ? (
                  <>
                    <Select
                      label="Player"
                      value={homePlayer}
                      placeholder="Select player"
                      options={homePlayers.map((player) => ({
                        value: player.generatedId,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setHomePlayer(e.target.value)}
                    />

                    <div>
                      <Typography>Penalty minutes</Typography>
                      <input
                        type="number"
                        value={homePenaltyMinutes || ""}
                        onChange={(e) =>
                          setHomePenaltyMinutes(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <Typography>Penalty type</Typography>
                      <input
                        type="text"
                        value={homePenaltyType || ""}
                        onChange={(e) => setHomePenaltyType(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Select
                      label="Scorer"
                      value={homePlayer || ""}
                      placeholder="Select player"
                      options={homePlayers.map((player) => ({
                        value: player.name,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setHomePlayer(e.target.value)}
                    />
                    <Select
                      label="Primary assist"
                      value={homeAssister || ""}
                      placeholder="Select player"
                      options={homePlayers.map((player) => ({
                        value: player.name,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setHomeAssister(e.target.value)}
                    />
                    <Select
                      label="Secondary assist"
                      value={homeSecondaryAssister || ""}
                      placeholder="Select player"
                      options={homePlayers.map((player) => ({
                        value: player.name,
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setHomeSecondaryAssister(e.target.value)}
                    />
                  </>
                )}

                {homeEvent === "goal" ? (
                  <Button onClick={() => addHomeGoalHandler()}>Add goal</Button>
                ) : (
                  <Button onClick={() => addHomePenaltyHandler()}>
                    Add penalty
                  </Button>
                )}
              </TeamContainer>
            </>
          )}
        </Container>
        <p>{isOverTime && "Overtime active"}</p>
        <ButtonContainer>
          <Button onClick={() => setIsOverTime(!isOverTime)}>
            Toggle Overtime
          </Button>
          <Button
            disabled={!game || game?.ended}
            onClick={() => endMatchHandler()}
          >
            End Game
          </Button>
          <Button onClick={() => setShowModal(false)}>Close</Button>
        </ButtonContainer>
      </Modal>
    </>
  );
};
const Overlay = styled.div`
  cursor: default;
  position: fixed;
  inset: 0;
  opacity: 10%;
  background-color: #000;
  z-index: 50;
  @media (max-width: 768px) {
    opacity: 100%;
  }
`;
const ButtonContainer = styled.div`
  align-self: center;
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 14px;
  }
`;

const Modal = styled.div`
  top: 5%;
  left: 10%;
  width: 80%;
  z-index: 100;
  position: absolute;
  margin: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--neutral-surface-contrast);
  @media (max-width: 768px) {
    top: 10%;
    left: 0;
    width: 90%;
  }
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TeamContainer = styled.div`
  height: 100%;
  width: 45%;
  padding: 2.5%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;

  @media (max-width: 768px) {
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

const EventsRow = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "home",
})<{ home: boolean }>`
  text-align: ${(props) => (props.home ? "right" : "left")};
  border-top: 1px solid;
  margin: 0;
`;

const EventText = styled.p`
  margin: 0;
`;

const EventHeader = styled.p`
  margin: 0;
  font-weight: 500;
`;

const GoalHeader = styled.p`
  margin: 0;
  font-weight: bold;
`;

const GameTimeContainer = styled.div`
  margin: auto;
`;
