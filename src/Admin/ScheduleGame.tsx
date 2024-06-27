import { styled } from "styled-components";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Team } from "../utils/types/Team";
import { addGame, getTeams } from "../utils/queries";
import { useUser } from "../utils/context/UserContext";
import { GameStage, GameType, Goal } from "../utils/types/Game";
import DatePicker from "react-datepicker";

export type NewGame = {
  gameId: string;
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
  const initialStartTime = new Date("2024-11-16T08:00:00"); // Hardcoded for MVP - start date of folkets cup
  const [startTime, setStartTime] = useState<Date | null>(initialStartTime);
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
    if (teamName === "TBD") home ? setHomeTeam("TBD") : setAwayTeam("TBD");
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
      console.log(startTime, gameType, gameStage);

      if (homeTeam && awayTeam && startTime && gameType && gameStage) {
        const generatedId = `${awayTeam}vs${homeTeam}${startTime.toString()}`;
        const newGame: NewGame = {
          gameId: generatedId,
          homeTeam: homeTeam,
          awayTeam: awayTeam,
          startTime: startTime.toString(),
          homeTeamGoals: [],
          awayTeamGoals: [],
          ended: false,
          gameType: gameType,
          gameStage: gameStage,
        };
        addGame(newGame, user?.accessToken);
        setMessage(`${awayTeam} @ ${homeTeam} has been scheduled`);
      } else {
        setMessage(`Fill in all fields`);
      }
    }
  };

  return (
    <Container>
      <h2>Admin Page - Add Game</h2>
      <>
        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            handleAddGame();
          }}
        >
          <Select onChange={(e) => handleTeamSelect(e.target.value, false)}>
            <option value="">Select away team</option>
            <option value="TBD">TBD</option>
            {teams.map((team) => (
              <option key={team._id} value={team.name}>
                {team.name}
              </option>
            ))}
          </Select>
          @
          <Select onChange={(e) => handleTeamSelect(e.target.value, true)}>
            <option value="">Select home team</option>
            <option value={"TBD"}>TBD</option>
            {teams.map((team) => (
              <option key={team._id} value={team.name}>
                {team.name}
              </option>
            ))}
          </Select>
          <DateContainer>
            <p>
              Selected Date and Time:
              <br />
              {startTime && format(startTime, "HH:mm - dd MMMM, yyyy")}
            </p>
            <DatePicker
              showTimeInput
              dateFormat="MMMM d, yyyy HH:mm"
              onChange={(date) => setStartTime(date)}
              selected={startTime}
            />
          </DateContainer>
          <Label>
            Game type:
            <Select
              value={gameType}
              onChange={(e) => setGameType(e.target.value as GameType)}
            >
              <option value="">Select type</option>
              {possibleGameType.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </Select>
          </Label>
          <Label>
            Game stage:
            <Select
              value={gameStage}
              onChange={(e) => setGameStage(e.target.value as GameStage)}
            >
              <option value="">Select stage</option>
              {possibleGameStage.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </Select>
          </Label>
          <Button type="submit">Add Game</Button>
          {message !== "" && <span>{message}</span>}
        </StyledForm>
      </>
    </Container>
  );
};

export default ScheduleGame;

const Container = styled.div`
  margin: auto;
  height: 100%;
  width: 90%;
  display: flex;
  flex-direction: column;
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
  margin-right: 0;
  margin-left: auto;
`;
const Label = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: 12px;
`;
const Select = styled.select`
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  margin: auto;
  width: 45%;
  padding: 8px;
`;
const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;
const StyledForm = styled.form`
  width: 100%;
`;
