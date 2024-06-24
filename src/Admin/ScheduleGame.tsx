import { styled } from "styled-components";

import React, { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { addGame, getTeams } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { GameStage, GameType, Goal } from "../utils/types/Game";
import DateTimePicker from "react-datetime-picker";

export type NewGame = {
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeTeamGoals: Goal[];
  awayTeamGoals: Goal[];
  ended: boolean;
  gameType: GameType;
  gameStage: GameStage;
};

const ScheduleGame: React.FC = () => {
  const [homeTeam, setHomeTeam] = useState<string | null>(null);
  const [awayTeam, setAwayTeam] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date>();
  const [gameType, setGameType] = useState<GameType>();
  const [gameStage, setGameStage] = useState<GameStage>();
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken)
        try {
          const teamsFromAPI = await getTeams(user.accessToken);
          setTeams(teamsFromAPI);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
    };

    fetchAllTeams();
  }, []);

  const handleTeamSelect = (teamName: string, home: boolean) => {
    const foundTeam = teams.find((team) => team.name === teamName);
    if (foundTeam) {
      home ? setHomeTeam(foundTeam.name) : setAwayTeam(foundTeam.name);
    }
  };

  const possibleGameType: GameType[] = [
    GameType.GroupA,
    GameType.GroupB,
    GameType.APlayoff,
    GameType.BPlayoff,
  ];
  const possibleGameStage: GameStage[] = [
    GameStage.Group,
    GameStage.Semi,
    GameStage.Final,
    GameStage.ThirdPlace,
  ];

  const handleAddGame = () => {
    console.log(awayTeam, "@", homeTeam);
    if (user?.accessToken) {
      if (awayTeam && homeTeam && startTime && gameType && gameStage) {
        const newGame: NewGame = {
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          startTime: startTime.toString(),
          homeTeamGoals: [],
          awayTeamGoals: [],
          ended: false,
          gameType: gameType,
          gameStage: gameStage,
        };
        console.log(newGame);
        addGame(newGame, user?.accessToken);
        setMessage(`${awayTeam} @ ${homeTeam} has been scheduled`);
      } else {
        setMessage(`Fill in all fields`);
      }
    }
  };
  const handleDateChange = (date: Date) => {
    setStartTime(date);
  };
  return (
    <Container>
      <h2>Admin Page - Add Game</h2>
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddGame();
          }}
        >
          <select onChange={(e) => handleTeamSelect(e.target.value, false)}>
            <option value="">Select away team</option>
            {teams.map((team) => (
              <option key={team._id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
          <select onChange={(e) => handleTeamSelect(e.target.value, true)}>
            <option value="">Select home team</option>
            {teams.map((team) => (
              <option key={team._id} value={team.name}>
                {team.name}
              </option>
            ))}
          </select>
          <label>
            Start time:
            <DateTimePicker
              id="dateTimePicker"
              onChange={() => handleDateChange}
              value={startTime}
            />
          </label>
          <br />
          <label>
            Game type:
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as GameType)}
            >
              {possibleGameType.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Game stage:
            <select
              value={gameStage}
              onChange={(e) => setGameStage(e.target.value as GameStage)}
            >
              {possibleGameStage.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Add Game</button>
        </form>
      </div>

      {message !== "" && <span>{message}</span>}
    </Container>
  );
};

export default ScheduleGame;

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
