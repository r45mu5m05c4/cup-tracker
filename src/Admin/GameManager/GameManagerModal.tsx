import { useCallback, useEffect, useState } from "react";
import { styled } from "styled-components";
import { Player } from "../../utils/types/Player";
import { Game, GameMetaData, Penalty } from "../../utils/types/Game";
import {
  addShotToGame,
  getGameByIdWithMetaData,
  getPlayersByTeam,
  getTeamById,
  updateGoalieStatsAfterGame,
} from "../../utils/queries";
import { Goal } from "../../utils/types/Game";
import {
  addGoalToGame,
  addPenaltyToGame,
  endMatch,
  giveDraw,
  giveLoss,
  giveWin,
} from "./helperFunctions";
import { GameTimer } from "../../molecules/GameTimer";
import { Typography } from "../../molecules/Typography";
import { Select } from "../../molecules/Select";
import { Button } from "../../molecules/Button";
import { Team } from "../../utils/types/Team";

interface GameManagerModalProps {
  pickedGame: GameMetaData;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const GameManagerModal = ({
  pickedGame,
  setShowModal,
}: GameManagerModalProps) => {
  const [game, setGame] = useState<GameMetaData>(pickedGame);
  const [homeTeam, setHomeTeam] = useState<Team>();
  const [awayTeam, setAwayTeam] = useState<Team>();
  const [homeGoalie, setHomeGoalie] = useState<number>();
  const [awayGoalie, setAwayGoalie] = useState<number>();
  const [homeShots, setHomeShots] = useState<number>(0);
  const [awayShots, setAwayShots] = useState<number>(0);
  const [homeGoals, setHomeGoals] = useState<Goal[]>(
    pickedGame.goals.filter(
      (g: Goal) => g.scoringTeamId === pickedGame.homeTeamId
    )
  );
  const [awayGoals, setAwayGoals] = useState<Goal[]>(
    pickedGame.goals.filter(
      (g: Goal) => g.scoringTeamId === pickedGame.awayTeamId
    )
  );
  const [homePenalties, setHomePenalties] = useState<Penalty[]>(
    pickedGame.penalties.filter(
      (g: Penalty) => g.teamId === pickedGame.homeTeamId
    )
  );
  const [awayPenalties, setAwayPenalties] = useState<Penalty[]>(
    pickedGame.penalties.filter(
      (g: Penalty) => g.teamId === pickedGame.awayTeamId
    )
  );
  const [homeEvent, setHomeEvent] = useState("");
  const [homePlayer, setHomePlayer] = useState<number>();
  const [homeAssister, setHomeAssister] = useState<number | null>(null);
  const [homeSecondaryAssister, setHomeSecondaryAssister] = useState<
    number | null
  >(null);
  const [homePenaltyMinutes, setHomePenaltyMinutes] = useState<number | null>(
    null
  );
  const [homePenaltyType, setHomePenaltyType] = useState("");

  const [awayEvent, setAwayEvent] = useState("");
  const [awayPlayer, setAwayPlayer] = useState<number>();
  const [awayAssister, setAwayAssister] = useState<number | null>(null);
  const [awaySecondaryAssister, setAwaySecondaryAssister] = useState<
    number | null
  >(null);
  const [awayPenaltyMinutes, setAwayPenaltyMinutes] = useState<number | null>(
    null
  );
  const [awayPenaltyType, setAwayPenaltyType] = useState("");

  const [gameMinute, setGameMinute] = useState<number>();
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [isOverTime, setIsOverTime] = useState<boolean>(false);

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
    getHomeTeamAndPlayers();
    getAwayTeamAndPlayers();
    updateElapsedMinutes();
  }, []);

  const refetchGame = useCallback(async () => {
    if (!game?.id) return;

    try {
      const gameFromAPI: Game | any = await getGameByIdWithMetaData(
        game.id,
        game.competitionId
      );
      setGame(gameFromAPI);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  }, [game?.id, game?.competitionId]);

  useEffect(() => {
    const addShot = async () => {
      if (game) {
        const updatedGame = {
          ...game,
          homeTeamShots: homeShots,
          awayTeamShots: awayShots,
        };
        await addShotToGame(updatedGame);
      }
    };

    addShot();
  }, [homeShots, awayShots]);

  const getHomeTeamAndPlayers = async () => {
    if (game) {
      try {
        const homeTeamFromAPI: Team = await getTeamById(
          game.homeTeamId,
          game.competitionId
        );
        setHomeTeam(homeTeamFromAPI);
        const playersInTeam = await getPlayersByTeam(
          game.homeTeamId,
          game.competitionId
        );
        setHomePlayers(playersInTeam);
      } catch (error) {
        console.error("Error fetching players in home team:", error);
      }
    }
  };

  const getAwayTeamAndPlayers = async () => {
    if (game) {
      try {
        const awayTeamFromAPI: Team = await getTeamById(
          game.awayTeamId,
          game.competitionId
        );
        setAwayTeam(awayTeamFromAPI);
        const playersInTeam = await getPlayersByTeam(
          game.awayTeamId,
          game.competitionId
        );
        setAwayPlayers(playersInTeam);
      } catch (error) {
        console.error("Error fetching players in away team:", error);
      }
    }
  };

  const addGoalHandler = async (home: boolean) => {
    const scorer = home ? homePlayer : awayPlayer;
    if (game && gameMinute && scorer) {
      const goal: Goal = {
        scorerId: scorer,
        primaryAssisterId: home ? homeAssister : awayAssister,
        secondaryAssisterId: home ? homeSecondaryAssister : awaySecondaryAssister,
        scoringTeamId: home ? game.homeTeamId : game.awayTeamId,
        concedingTeamId: home ? game.awayTeamId : game.homeTeamId,
        gameMinute: gameMinute,
        gameId: game.id,
        competitionId: game.competitionId,
      };
      await addGoalToGame(goal);
      if (home) {
        const updatedHomeGoals = [...homeGoals, goal];
        setHomeGoals(updatedHomeGoals);
      } else {
        const updatedAwayGoals = [...awayGoals, goal];
        setAwayGoals(updatedAwayGoals);
      }
      refetchGame();
    }
  };

  const addPenaltyHandler = async (home: boolean) => {
    const player = home
      ? homePlayers.find((p) => p.id === homePlayer)
      : awayPlayers.find((p) => p.id === awayPlayer);
    const pims = home ? homePenaltyMinutes : awayPenaltyMinutes;
    const type = home ? homePenaltyType : awayPenaltyType;
    if (player && game?.id && pims && gameMinute && awayPenaltyType) {
      const penalty: Penalty = {
        playerId: player.id,
        teamId: home ? game.homeTeamId : game.awayTeamId,
        penaltyMinutes: pims,
        gameMinute: gameMinute,
        penaltyType: type,
        gameId: game.id,
        competitionId: game.competitionId,
      };
      await addPenaltyToGame(penalty);
      if (home) {
        const updatedHomePenalties = [...homePenalties, penalty];
        setHomePenalties(updatedHomePenalties);
      } else {
        const updatedAwayPenalties = [...awayPenalties, penalty];
        setAwayPenalties(updatedAwayPenalties);
      }
      refetchGame();
    }
  };
  const endMatchHandler = async () => {
    if (game && awayTeam && homeTeam) {
      game.ended = true;
      await endMatch(game, [...homePlayers, ...awayPlayers]);
      if (homeGoals.length === awayGoals.length) {
        await giveDraw(awayTeam, homeTeam);
      } else {
        const winner =
          awayGoals.length > homeGoals.length ? awayTeam : homeTeam;
        const loser = awayGoals.length < homeGoals.length ? awayTeam : homeTeam;
        await giveWin(winner);
        await giveLoss(loser, isOverTime);
      }
      if (homeGoalie && awayGoalie) {
        const awayWinner = awayGoals.length > homeGoals.length;
        const homeWinner = awayGoals.length < homeGoals.length;
        try {
          await updateGoalieStatsAfterGame(
            homeGoalie,
            homeWinner ? 1 : 0,
            game.awayTeamShots,
            awayGoals.length,
            game.competitionId
          );
          await updateGoalieStatsAfterGame(
            awayGoalie,
            awayWinner ? 1 : 0,
            game.homeTeamShots,
            homeGoals.length,
            game.competitionId
          );
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
  const getPlayerName = (playerId: number, home: boolean) => {
    if (home) {
      const player = homePlayers.find((p) => p.id === playerId);
      return player?.name;
    } else {
      const player = awayPlayers.find((p) => p.id === playerId);
      return player?.name;
    }
  };
  const eventRenderer = () => {
    if (!game) return;
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
                {event.gameMinute}' GOAL by {event.scorerId}
              </GoalHeader>
              <EventText>
                Assisted by: {event.primaryAssisterId}, {event.secondaryAssisterId}
              </EventText>
            </>
          </EventsRow>
        );
      else if (isPenalty(event))
        return (
          <EventsRow key={index} home={event.home}>
            <EventHeader>
              {event.gameMinute}' Penalty for
              {getPlayerName(event.playerId, event.home)}
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
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        {game && awayTeam && homeTeam && (
          <LiveGame>
            <Header>
              {awayTeam.name} @ {homeTeam.name}
            </Header>
            <GoalsRow>
              <AwayGoals>{awayGoals.length}</AwayGoals>
              <GameTimeContainer>
                {game.startTime && (
                  <GameTimer
                    startTime={new Date(game.startTime)}
                    ended={game.ended}
                  />
                )}
              </GameTimeContainer>
              <HomeGoals>{homeGoals.length}</HomeGoals>
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
                      value: player.id.toString(),
                      label: `${player.jerseyNumber} - ${player.name}`,
                    }))}
                  onChange={(e) => setAwayGoalie(parseInt(e.target.value))}
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
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setAwayPlayer(parseInt(e.target.value))}
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
                      value={awayPlayer || 0}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setAwayPlayer(parseInt(e.target.value))}
                    />
                    <Select
                      label="Primary assist"
                      value={awayAssister || 0}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) =>
                        setAwayAssister(parseInt(e.target.value))
                      }
                    />
                    <Select
                      label="Secondary assist"
                      value={awaySecondaryAssister || ""}
                      placeholder="Select player"
                      options={awayPlayers.map((player) => ({
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) =>
                        setAwaySecondaryAssister(parseInt(e.target.value))
                      }
                    />
                  </>
                )}
                {awayEvent === "goal" ? (
                  <Button onClick={() => addGoalHandler(false)}>
                    Add goal
                  </Button>
                ) : (
                  <Button onClick={() => addPenaltyHandler(false)}>
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
                      value: player.id.toString(),
                      label: `${player.jerseyNumber} - ${player.name}`,
                    }))}
                  onChange={(e) => setHomeGoalie(parseInt(e.target.value))}
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
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setHomePlayer(parseInt(e.target.value))}
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
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) => setHomePlayer(parseInt(e.target.value))}
                    />
                    <Select
                      label="Primary assist"
                      value={homeAssister || ""}
                      placeholder="Select player"
                      options={homePlayers.map((player) => ({
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) =>
                        setHomeAssister(parseInt(e.target.value))
                      }
                    />
                    <Select
                      label="Secondary assist"
                      value={homeSecondaryAssister || ""}
                      placeholder="Select player"
                      options={homePlayers.map((player) => ({
                        value: player.id.toString(),
                        label: `${player.jerseyNumber} - ${player.name}`,
                      }))}
                      onChange={(e) =>
                        setHomeSecondaryAssister(parseInt(e.target.value))
                      }
                    />
                  </>
                )}

                {homeEvent === "goal" ? (
                  <Button onClick={() => addGoalHandler(true)}>Add goal</Button>
                ) : (
                  <Button onClick={() => addPenaltyHandler(true)}>
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
