import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useUser } from "../../utils/context/UserContext";
import { Player } from "../../utils/types/Player";
import { Game, Penalty } from "../../utils/types/Game";
import { getGames, getPlayerByTeam } from "../../utils/queries";
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
import addGoal from "./addGoal";
import GameTimer from "../../molecules/GameTimer";
import { useCompetition } from "../../utils/context/CompetitionContext";

const GameManager = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [game, setGame] = useState<Game>();
  const [homeEvent, setHomeEvent] = useState("");
  const [homePlayer, setHomePlayer] = useState<string | null>(null);
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
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

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

  const gamePicker = (gameId: string) => {
    const foundGame = games && games.find((g) => g._id === gameId);
    foundGame && setGame(foundGame);
  };

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const gamesFromAPI = await getGames(
            user.accessToken,
            competition.name
          );
          setGames(gamesFromAPI);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, [user]);

  useEffect(() => {
    if (game) {
      getHomeTeamPlayers();
      getAwayTeamPlayers();
      updateElapsedMinutes();
    }
  }, [game]);

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
    if (
      homePlayer &&
      homeAssister &&
      homeSecondaryAssister &&
      game?.gameId &&
      gameMinute &&
      user?.accessToken
    ) {
      const goal: Goal = {
        scorer: homePlayer,
        primaryAssist: homeAssister,
        secondaryAssist: homeSecondaryAssister,
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
        await giveLoss(loser, user.accessToken, game.competition);
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
        {games.length > 0 && !game && (
          <Label>
            Select game to manage:
            <Select value={game} onChange={(e) => gamePicker(e.target.value)}>
              <option key={""} value={""}>
                Select game
              </option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.awayTeam} @ {g.homeTeam}, {g.gameStage}
                </option>
              ))}
            </Select>
          </Label>
        )}
        {game && (
          <>
            <AwayContainer>
              <h3>Away</h3>
              <Label>
                Game Minute:
                <input
                  type="number"
                  value={gameMinute}
                  onChange={(e) => setGameMinute(parseInt(e.target.value))}
                />
              </Label>
              <Label>
                Event:
                <Select
                  value={awayEvent}
                  onChange={(e) => setAwayEvent(e.target.value)}
                >
                  <option key={""} value={""}>
                    Select event
                  </option>
                  <option key={"goal"} value={"goal"}>
                    Goal
                  </option>
                  <option key={"pim"} value={"pim"}>
                    Penalty
                  </option>
                </Select>
              </Label>
              {awayEvent === "pim" ? (
                <div>
                  <Label>
                    Player:
                    <Select
                      value={awayPlayer}
                      onChange={(e) => setAwayPlayer(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {awayPlayers.map((player) => (
                        <option key={player._id} value={player.generatedId}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Penalty Minutes:
                    <input
                      type="number"
                      value={awayPenaltyMinutes || ""}
                      onChange={(e) =>
                        setAwayPenaltyMinutes(parseInt(e.target.value))
                      }
                    />
                  </Label>
                  <Label>
                    Penalty Type:
                    <input
                      type="text"
                      value={awayPenaltyType || ""}
                      onChange={(e) => setAwayPenaltyType(e.target.value)}
                    />
                  </Label>
                </div>
              ) : (
                <div>
                  <Label>
                    Scorer:
                    <Select
                      value={awayPlayer || ""}
                      onChange={(e) => setAwayPlayer(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {awayPlayers.map((player) => (
                        <option key={player._id} value={player.name}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Primary assist:
                    <Select
                      value={awayAssister || ""}
                      onChange={(e) => setAwayAssister(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {awayPlayers.map((player) => (
                        <option key={player._id} value={player.name}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Secondary assist:
                    <Select
                      value={awaySecondaryAssister || ""}
                      onChange={(e) => setAwaySecondaryAssister(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {awayPlayers.map((player) => (
                        <option key={player._id} value={player.name}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                </div>
              )}

              {awayEvent === "goal" ? (
                <Button onClick={() => addAwayGoalHandler()}>Add goal</Button>
              ) : (
                <Button onClick={() => addAwayPenaltyHandler()}>
                  Add penalty
                </Button>
              )}
            </AwayContainer>
            <HomeContainer>
              <h3>Home</h3>
              <Label>
                Game Minute:
                <input
                  type="number"
                  value={gameMinute}
                  onChange={(e) => setGameMinute(parseInt(e.target.value))}
                />
              </Label>
              <Label>
                Event:
                <Select
                  value={homeEvent}
                  onChange={(e) => setHomeEvent(e.target.value)}
                >
                  <option key={""} value={""}>
                    Select event
                  </option>
                  <option key={"goal"} value={"goal"}>
                    Goal
                  </option>
                  <option key={"pim"} value={"pim"}>
                    Penalty
                  </option>
                </Select>
              </Label>
              {homeEvent !== "" && homeEvent === "pim" ? (
                <div>
                  <Label>
                    Player:
                    <Select
                      value={homePlayer || ""}
                      onChange={(e) => setHomePlayer(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {homePlayers.map((player) => (
                        <option key={player._id} value={player.generatedId}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Penalty Minutes:
                    <input
                      type="number"
                      value={homePenaltyMinutes || ""}
                      onChange={(e) =>
                        setHomePenaltyMinutes(parseInt(e.target.value))
                      }
                    />
                  </Label>
                  <Label>
                    Penalty Type:
                    <input
                      type="text"
                      value={homePenaltyType || ""}
                      onChange={(e) => setHomePenaltyType(e.target.value)}
                    />
                  </Label>
                </div>
              ) : (
                <div>
                  <Label>
                    Scorer:
                    <Select
                      value={homePlayer || ""}
                      onChange={(e) => setHomePlayer(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {homePlayers.map((player) => (
                        <option key={player._id} value={player.name}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Primary assist:
                    <Select
                      value={homeAssister || ""}
                      onChange={(e) => setHomeAssister(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {homePlayers.map((player) => (
                        <option key={player._id} value={player.name}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                  <Label>
                    Secondary assist:
                    <Select
                      value={homeSecondaryAssister || ""}
                      onChange={(e) => setHomeSecondaryAssister(e.target.value)}
                    >
                      <option key={""} value="">
                        Select a player
                      </option>
                      {homePlayers.map((player) => (
                        <option key={player._id} value={player.name}>
                          {player.jerseyNumber} - {player.name}
                        </option>
                      ))}
                    </Select>
                  </Label>
                </div>
              )}

              {homeEvent === "goal" ? (
                <Button onClick={() => addHomeGoalHandler()}>Add goal</Button>
              ) : (
                <Button onClick={() => addHomePenaltyHandler()}>
                  Add penalty
                </Button>
              )}
            </HomeContainer>
          </>
        )}
      </Container>
      <Button disabled={game?.ended} onClick={() => endMatchHandler()}>
        End Game
      </Button>
    </>
  );
};
export default GameManager;

const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
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
    background-color: #bababa;
    cursor: default;
    &:hover {
      border: 1px solid transparent;
    }
  }
`;
const HomeContainer = styled.div`
  height: 100%;
  width: 45%;
  padding: 2.5%;
  display: flex;
  flex-direction: column;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const AwayContainer = styled.div`
  height: 100%;
  width: 45%;
  padding: 2.5%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 5px;
  @media (max-width: 768px) {
    font-size: 0.8em;
    flex-direction: column;
  }
`;
const Select = styled.select`
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: auto;
  margin-right: 0;
  width: 70%;
  padding: 8px;
  @media (max-width: 768px) {
    font-size: 0.8em;
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
