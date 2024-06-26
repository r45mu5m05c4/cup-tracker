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
} from "./helperFunctions";
import addGoal from "./addGoal";

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
  const { user } = useUser();

  const gamePicker = (gameId: string) => {
    const foundGame = games && games.find((g) => g._id === gameId);
    foundGame && setGame(foundGame);
  };

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken)
        try {
          const gamesFromAPI = await getGames(user.accessToken);
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
    }
  }, [game]);

  const getHomeTeamPlayers = async () => {
    if (game && user?.accessToken) {
      try {
        const playersInTeam = await getPlayerByTeam(
          game.homeTeam,
          user.accessToken
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
        const playersInTeam = await getPlayerByTeam(
          game.awayTeam,
          user.accessToken
        );
        setAwayPlayers(playersInTeam);
      } catch (error) {
        console.error("Error fetching players in away team:", error);
      }
    }
  };

  const addHomeGoalHandler = () => {
    console.log(homePlayer, homeAssister, homeSecondaryAssister);
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
      addGoal(goal, user.accessToken);

      addGoalToHomeTeamCurrentGame(game.gameId, goal, user.accessToken);
    }
  };

  const addAwayGoalHandler = () => {
    console.log(awayPlayer, awayAssister, awaySecondaryAssister);
    console.log(game);
    if (awayPlayer && game?.gameId && gameMinute && user?.accessToken) {
      const goal: Goal = {
        scorer: awayPlayer,
        primaryAssist: awayAssister ? awayAssister : "Unassisted",
        secondaryAssist: awaySecondaryAssister ? awaySecondaryAssister : "",
        scoringTeamId: game.awayTeam,
        concedingTeamId: game.homeTeam,
        gameMinute: gameMinute,
      };
      console.log(goal);
      addGoal(goal, user?.accessToken);

      addGoalToAwayTeamCurrentGame(game.gameId, goal, user.accessToken);
    }
  };
  const addHomePenaltyHandler = () => {
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
      const penalty: Penalty = {
        playerId: homePlayer,
        playerName: foundHomePlayer.name,
        team: game.homeTeam,
        minutes: homePenaltyMinutes,
        gameMinute: gameMinute,
        penaltyType: homePenaltyType,
      };
      addPenalty(homePenaltyMinutes, homePlayer, user.accessToken);
      addPenaltyToMatch(game?.gameId, penalty, user.accessToken);
    }
  };

  const addAwayPenaltyHandler = () => {
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
      const penalty: Penalty = {
        playerId: awayPlayer,
        playerName: foundAwayPlayer.name,
        team: game.awayTeam,
        minutes: awayPenaltyMinutes,
        gameMinute: gameMinute,
        penaltyType: awayPenaltyType,
      };
      addPenalty(awayPenaltyMinutes, awayPlayer, user.accessToken);
      addPenaltyToMatch(game?.gameId, penalty, user.accessToken);
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
      {game && (
        <LiveGame>
          <Header>
            {game.awayTeam} @ {game.homeTeam}
          </Header>
          <GoalsRow>
            <AwayGoals>{game.awayTeamGoals.length}</AwayGoals>
            <HomeGoals>{game.homeTeamGoals.length}</HomeGoals>
          </GoalsRow>
          {eventRenderer()}
        </LiveGame>
      )}
      <Label>
        Game Minute:
        <input
          type="number"
          value={gameMinute}
          onChange={(e) => setGameMinute(parseInt(e.target.value))}
        />
      </Label>
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
`;
const HomeContainer = styled.div`
  height: 100%;
  width: 45%;
  padding: 2.5%;
  display: flex;
  flex-direction: column;
`;
const AwayContainer = styled.div`
  height: 100%;
  width: 45%;
  padding: 2.5%;
  display: flex;
  flex-direction: column;
`;
const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 5px;
`;
const Select = styled.select`
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: auto;
  margin-right: 0;
  width: 70%;
  padding: 8px;
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
const EventText = styled.p``;
const EventHeader = styled.p`
  font-weight: bold;
`;
