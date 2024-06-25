import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { useUser } from "../../utils/context/UserContext";
import { Player } from "../../utils/types/Player";
import { Game } from "../../utils/types/Game";
import { getGames, getPlayerByTeam } from "../../utils/queries";
import addGoal from "./addGoal";
import { Goal } from "../../utils/types/Goal";
import { addPenalty } from "./helperFunctions";

const GameManager = () => {
  const [games, setGames] = useState<Game[]>();
  const [game, setGame] = useState<Game>();
  const [homeEvent, setHomeEvent] = useState("");
  const [homePlayer, setHomePlayer] = useState<string>();
  const [homeAssister, setHomeAssister] = useState<string>();
  const [homeSecondaryAssister, setHomeSecondaryAssister] = useState<string>();
  const [homePenaltyMinutes, setHomePenaltyMinutes] = useState<number>();

  const [awayEvent, setAwayEvent] = useState("");
  const [awayPlayer, setAwayPlayer] = useState<string>();
  const [awayAssister, setAwayAssister] = useState<string>();
  const [awaySecondaryAssister, setAwaySecondaryAssister] = useState<string>();
  const [awayPenaltyMinutes, setAwayPenaltyMinutes] = useState<number>();

  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const { user } = useUser();

  const gamePicker = (gameId: string) => {
    const foundGame = games && games.find((g) => g.id === gameId);
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
  }, []);

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
    if (homePlayer && homeAssister && homeSecondaryAssister && game?.id) {
      const goal: Goal = {
        playerId: homePlayer,
        assistPlayerId: homeAssister,
        secondaryAssistPlayerId: homeSecondaryAssister,
        matchId: game.id,
        scoringTeamId: game.homeTeam,
        concedingTeamId: game.awayTeam,
      };
      addGoal(goal);
    }
  };

  const addAwayGoalHandler = () => {
    if (awayPlayer && awayAssister && awaySecondaryAssister && game?.id) {
      const goal: Goal = {
        playerId: awayPlayer,
        assistPlayerId: awayAssister,
        secondaryAssistPlayerId: awaySecondaryAssister,
        matchId: game.id,
        scoringTeamId: game.awayTeam,
        concedingTeamId: game.homeTeam,
      };
      addGoal(goal);
    }
  };
  const addHomePenaltyHandler = () => {
    if (homePlayer && homeAssister && homeSecondaryAssister && game?.id) {
      const goal: Goal = {
        playerId: homePlayer,
        assistPlayerId: homeAssister,
        secondaryAssistPlayerId: homeSecondaryAssister,
        matchId: game.id,
        scoringTeamId: game.homeTeam,
        concedingTeamId: game.awayTeam,
      };
      addGoal(goal);
    }
  };

  const addAwayPenaltyHandler = () => {
    if (awayPlayer && game?.id) {
      addPenalty(1, awayPlayer);
    }
  };

  return (
    <Container>
      {games && !game && (
        <label>
          Select game to manage:
          <select value={game} onChange={(e) => gamePicker(e.target.value)}>
            {games.map((g) => (
              <option key={g.id} value={g.id}>
                {g.awayTeam} @ {g.homeTeam}
              </option>
            ))}
          </select>
        </label>
      )}
      <AwayContainer>
        <label>
          Event:
          <select
            value={awayEvent}
            onChange={(e) => setAwayEvent(e.target.value)}
          >
            <option key={"goal"} value={"goal"}>
              Goal
            </option>
            <option key={"pim"} value={"pim"}>
              Penalty
            </option>
          </select>
        </label>
        {awayEvent !== "" && awayEvent === "pim" ? (
          <div>
            <label>
              Player:
              <select
                value={awayEvent}
                onChange={(e) => setAwayPlayer(e.target.value)}
              >
                <option value="">Select a player</option>
                {awayPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Penalty Minutes:
              <input
                type="number"
                value={awayPenaltyMinutes}
                onChange={(e) =>
                  setAwayPenaltyMinutes(parseInt(e.target.value))
                }
              />
            </label>
          </div>
        ) : (
          <div>
            <label>
              Scorer:
              <select
                value={awayPlayer}
                onChange={(e) => setAwayPlayer(e.target.value)}
              >
                <option value="">Select a player</option>
                {awayPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Primary assist:
              <select
                value={awayAssister}
                onChange={(e) => setAwayAssister(e.target.value)}
              >
                <option value="">Select a player</option>
                {awayPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Secondary assist:
              <select
                value={awaySecondaryAssister}
                onChange={(e) => setAwaySecondaryAssister(e.target.value)}
              >
                <option value="">Select a player</option>
                {awayPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {awayEvent === "goal" ? (
          <Button onClick={() => addAwayGoalHandler()}>Add goal</Button>
        ) : (
          <Button onClick={() => addAwayPenaltyHandler()}>Add penalty</Button>
        )}
      </AwayContainer>
      <HomeContainer>
        <label>
          Event:
          <select
            value={homeEvent}
            onChange={(e) => setHomeEvent(e.target.value)}
          >
            <option key={"goal"} value={"goal"}>
              Goal
            </option>
            <option key={"pim"} value={"pim"}>
              Penalty
            </option>
          </select>
        </label>
        {homeEvent !== "" && homeEvent === "pim" ? (
          <div>
            <label>
              Player:
              <select
                value={homeEvent}
                onChange={(e) => setHomePlayer(e.target.value)}
              >
                <option value="">Select a player</option>
                {homePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>{" "}
            <label>
              Penalty Minutes:
              <input
                type="number"
                value={homePenaltyMinutes}
                onChange={(e) =>
                  setHomePenaltyMinutes(parseInt(e.target.value))
                }
              />
            </label>
          </div>
        ) : (
          <div>
            <label>
              Scorer:
              <select
                value={homePlayer}
                onChange={(e) => setHomePlayer(e.target.value)}
              >
                <option value="">Select a player</option>
                {homePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Primary assist:
              <select
                value={homeAssister}
                onChange={(e) => setHomeAssister(e.target.value)}
              >
                <option value="">Select a player</option>
                {homePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Secondary assist:
              <select
                value={homeSecondaryAssister}
                onChange={(e) => setHomeSecondaryAssister(e.target.value)}
              >
                <option value="">Select a player</option>
                {homePlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.jerseyNumber} - {player.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        {homeEvent === "goal" ? (
          <Button onClick={() => addHomeGoalHandler()}>Add goal</Button>
        ) : (
          <Button onClick={() => addHomePenaltyHandler()}>Add penalty</Button>
        )}
      </HomeContainer>
    </Container>
  );
};
export default GameManager;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;
const Button = styled.button`
  color: #fff;
  margin: 24px;
`;
const HomeContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const AwayContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;
