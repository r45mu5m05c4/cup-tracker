import { styled } from "styled-components";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Team } from "../../utils/types/Team";
import { addGame, getTeams } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { GameStage, GameType, Goal } from "../../utils/types/Game";
import DatePicker from "react-datepicker";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { Typography } from "../../molecules/Typography";
import { Button } from "../../molecules/Button";
import { Select } from "../../molecules/Select";

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
  competition: string;
};
interface ScheduleGameModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
export const ScheduleGameModal = ({ setShowModal }: ScheduleGameModalProps) => {
  const [homeTeam, setHomeTeam] = useState<string | null>(null);
  const [awayTeam, setAwayTeam] = useState<string | null>(null);
  const initialStartTime = new Date("2024-11-16T08:00:00"); // Hardcoded for MVP - start date of folkets cup
  const [startTime, setStartTime] = useState<Date | null>(initialStartTime);
  const [gameType, setGameType] = useState<GameType>();
  const [gameStage, setGameStage] = useState<GameStage>();
  const [message, setMessage] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const { user, refreshAccessToken } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllTeams = async () => {
      if (user?.accessToken && competition)
        try {
          await refreshAccessToken();
          const teamsFromAPI = await getTeams(
            user.accessToken,
            competition.name
          );
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

  const handleAddGame = async () => {
    console.log(awayTeam, "@", homeTeam);
    if (user?.accessToken) {
      console.log(startTime, gameType, gameStage);

      if (
        homeTeam &&
        awayTeam &&
        startTime &&
        gameType &&
        gameStage &&
        competition
      ) {
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
          competition: competition.name,
        };
        try {
          await refreshAccessToken();
          await addGame(newGame, user?.accessToken);
          setMessage(`${awayTeam} @ ${homeTeam} has been scheduled`);
        } catch (e) {
          console.log(e);
          setMessage("Something went wrong, game not scheduled");
        }
      } else {
        setMessage(`Fill in all fields`);
      }
    }
  };

  const teamOptions = [
    { value: "TBD", label: "TBD" },
    ...teams.map((team) => ({
      value: team.name,
      label: team.name,
    })),
  ];

  return (
    <>
      <Overlay onClick={() => setShowModal(false)} />
      <Modal onClick={(e) => e.stopPropagation()}>
        <Container>
          <StyledForm
            onSubmit={(e) => {
              e.preventDefault();
              handleAddGame();
            }}
          >
            <div>
              <Typography style={{ fontWeight: "500", marginBottom: "8px" }}>
                Teams
              </Typography>
              <TeamsContainer>
                <Select
                  placeholder="Select away team"
                  options={teamOptions}
                  onChange={(e) => handleTeamSelect(e.target.value, false)}
                />
                <Typography style={{ fontWeight: "500", fontSize: "1.2em" }}>
                  @
                </Typography>
                <Select
                  placeholder="Select home team"
                  options={teamOptions}
                  onChange={(e) => handleTeamSelect(e.target.value, true)}
                />
              </TeamsContainer>
            </div>

            <DateContainer>
              <Typography style={{ fontWeight: "500" }}>
                Date and time
              </Typography>
              <DatePicker
                showTimeInput
                dateFormat="MMMM d, yyyy HH:mm"
                onChange={(date) => setStartTime(date)}
                selected={startTime}
              />
              <Typography style={{ marginTop: "12px" }}>
                {startTime && format(startTime, "HH:mm - dd MMMM, yyyy")}
              </Typography>
            </DateContainer>

            <Select
              label="Game type"
              value={gameType}
              placeholder="Select type"
              options={possibleGameType.map((type) => ({
                value: type,
                label: type,
              }))}
              onChange={(e) => setGameType(e.target.value as GameType)}
            />

            <Select
              label="Game stage"
              value={gameStage}
              placeholder="Select stage"
              options={possibleGameStage.map((stage) => ({
                value: stage,
                label: stage,
              }))}
              onChange={(e) => setGameStage(e.target.value as GameStage)}
            />

            <ButtonContainer>
              <Button type="submit" onClick={() => {}}>
                Add game
              </Button>
              <Button onClick={() => setShowModal(false)}>Close</Button>
            </ButtonContainer>
            {message !== "" && (
              <Typography style={{ marginTop: "24px" }}>{message}</Typography>
            )}
          </StyledForm>
        </Container>
      </Modal>
    </>
  );
};
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 24px;
  gap: 24px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const TeamsContainer = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const DateContainer = styled.div`
  display: flex;
  flex-direction: column;
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
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  background-color: var(--neutral-surface-contrast);
  @media (max-width: 768px) {
    top: 10%;
    left: 0;
    width: 90%;
  }
`;
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
