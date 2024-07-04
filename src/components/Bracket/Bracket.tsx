import { useEffect, useState } from "react";
import { getGames } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Game } from "../../utils/types/Game";
import { styled } from "styled-components";
import GameItem from "../../molecules/GameItem";
import GameModal from "../Games/GameModal";
import { useCompetition } from "../../utils/context/CompetitionContext";

const Bracket = () => {
  const [games, setGames] = useState<Game[]>();
  const [semisA, setSemisA] = useState<Game[]>([]);
  const [semisB, setSemisB] = useState<Game[]>([]);
  const [finalA, setFinalA] = useState<Game>();
  const [finalB, setFinalB] = useState<Game>();
  const [thirdPlaceA, setThirdPlaceA] = useState<Game>();
  const [thirdPlaceB, setThirdPlaceB] = useState<Game>();
  const [openGame, setOpenGame] = useState<Game>();
  const [showModal, setShowModal] = useState(false);
  const { user } = useUser();
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken && competition)
        try {
          const gamesFromAPI = await getGames(
            user.accessToken,
            competition.name
          );

          const playoffGames: Game[] = gamesFromAPI.filter(
            (g: Game) =>
              g.gameType === "a_playoff" || g.gameType === "b_playoff"
          );
          setGames(playoffGames);
          const poolAGames = playoffGames.filter(
            (g: Game) => g.gameType === "a_playoff"
          );
          const poolBGames = playoffGames.filter(
            (g: Game) => g.gameType === "b_playoff"
          );
          const poolASemis = poolAGames.filter(
            (g: Game) => g.gameStage === "semi"
          );
          setSemisA(poolASemis);
          const poolBSemis = poolBGames.filter(
            (g: Game) => g.gameStage === "semi"
          );
          setSemisB(poolBSemis);

          const poolAFinal = poolAGames.find(
            (g: Game) => g.gameStage === "final"
          );
          setFinalA(poolAFinal);
          const poolBFinal = poolBGames.find(
            (g: Game) => g.gameStage === "final"
          );
          setFinalB(poolBFinal);
          const poolAThirdPlace = poolAGames.find(
            (g: Game) => g.gameStage === "third_place"
          );
          setThirdPlaceA(poolAThirdPlace);
          const poolBThirdPlace = poolBGames.find(
            (g: Game) => g.gameStage === "third_place"
          );
          setThirdPlaceB(poolBThirdPlace);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, []);
  const handleOpenGame = (gameId: string | undefined) => {
    const foundGame = gameId && games?.find((g) => g._id === gameId);
    if (foundGame) {
      setOpenGame(foundGame);
      setShowModal(true);
    }
  };
  const genTeamPlaceholder = (game: Game, semi1?: boolean): Game => {
    if (game.homeTeam === "TBD" && semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam =
            game.gameType === "a_playoff" ? "Group A 1st" : "Group A 3rd";
          break;
        case "third_place":
          game.homeTeam = "Loser S1";
          break;
        case "final":
          game.homeTeam = "Winner S1";
          break;
        default:
          game.homeTeam = "TBD";
          break;
      }
    }
    if (game.homeTeam === "TBD" && !semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam =
            game.gameType === "a_playoff" ? "Group B 1st" : "Group B 3rd";
          break;
        case "third_place":
          game.homeTeam = "Loser S2";
          break;
        case "final":
          game.homeTeam = "Winner S2";
          break;
        default:
          game.homeTeam = "TBD";
          break;
      }
    }
    if (game.awayTeam === "TBD" && semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam =
            game.gameType === "b_playoff" ? "Group A 2nd" : "Group A 4th";
          break;
        case "third_place":
          game.homeTeam = "Loser S1";
          break;
        case "final":
          game.homeTeam = "Winner S1";
          break;
        default:
          game.homeTeam = "TBD";
          break;
      }
    }
    if (game.awayTeam === "TBD" && !semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam =
            game.gameType === "b_playoff" ? "Group B 2nd" : "Group B 4th";
          break;
        case "third_place":
          game.homeTeam = "Loser S2";
          break;
        case "final":
          game.homeTeam = "Winner S2";
          break;
        default:
          game.homeTeam = "TBD";
          break;
      }
    }
    return game;
  };
  return (
    <PlayoffContainer>
      {showModal && openGame && (
        <GameModal game={openGame} setShowModal={setShowModal} />
      )}
      <h3 style={{ marginBottom: 0 }}>Division A Playoffs</h3>
      <PlayoffA>
        {semisA.length > 0 ? (
          <SemiFinal>
            {semisA.map((semi: Game, i) => (
              <SemiFinalItem key={semi.gameId}>
                Semi
                <GameItem
                  key={semi.gameId}
                  game={
                    semi.homeTeam !== "TBD" || semi.awayTeam !== "TBD"
                      ? genTeamPlaceholder(semi, i === 0 ? true : false)
                      : semi
                  }
                  handleOpenGame={handleOpenGame}
                />
              </SemiFinalItem>
            ))}
          </SemiFinal>
        ) : (
          <SemiFinal>
            <SemiFinalItem>
              Semi 1
              <PlaceHolderCard>Group A Winner @ Group B Second</PlaceHolderCard>
            </SemiFinalItem>
            <SemiFinalItem>
              Semi 2
              <PlaceHolderCard>Group B Winner @ Group A Second</PlaceHolderCard>
            </SemiFinalItem>
          </SemiFinal>
        )}
        <ThirdPlace>
          Third place
          {thirdPlaceA ? (
            <GameItem
              game={
                thirdPlaceA.homeTeam !== "TBD" || thirdPlaceA.awayTeam !== "TBD"
                  ? genTeamPlaceholder(thirdPlaceA)
                  : thirdPlaceA
              }
              handleOpenGame={handleOpenGame}
            />
          ) : (
            <PlaceHolderCard>Loser S1 @ Loser S2</PlaceHolderCard>
          )}
        </ThirdPlace>
        <Final>
          Final
          {finalA ? (
            <GameItem
              game={
                finalA.homeTeam !== "TBD" || finalA.awayTeam !== "TBD"
                  ? genTeamPlaceholder(finalA)
                  : finalA
              }
              handleOpenGame={handleOpenGame}
            />
          ) : (
            <PlaceHolderCard>Winner S1 @ Winner S2</PlaceHolderCard>
          )}
        </Final>
      </PlayoffA>
      <h3 style={{ marginBottom: 0 }}>Division B Playoffs</h3>
      <PlayoffB>
        {semisB.length > 0 ? (
          <SemiFinal>
            {semisB.map((semi: Game, i) => (
              <SemiFinalItem key={semi.gameId}>
                Semi
                <GameItem
                  key={semi.gameId}
                  game={
                    semi.homeTeam !== "TBD" || semi.awayTeam !== "TBD"
                      ? genTeamPlaceholder(semi, i === 0 ? true : false)
                      : semi
                  }
                  handleOpenGame={handleOpenGame}
                />
              </SemiFinalItem>
            ))}
          </SemiFinal>
        ) : (
          <SemiFinal>
            <SemiFinalItem>
              Semi 1
              <PlaceHolderCard>Group A Third @ Group B Fourth</PlaceHolderCard>
            </SemiFinalItem>
            <SemiFinalItem>
              Semi 2
              <PlaceHolderCard>Group B Third @ Group A Fourth</PlaceHolderCard>
            </SemiFinalItem>
          </SemiFinal>
        )}
        <ThirdPlace>
          Third place
          {thirdPlaceB ? (
            <GameItem
              game={
                thirdPlaceB.homeTeam !== "TBD" || thirdPlaceB.awayTeam !== "TBD"
                  ? genTeamPlaceholder(thirdPlaceB)
                  : thirdPlaceB
              }
              handleOpenGame={handleOpenGame}
            />
          ) : (
            <PlaceHolderCard>Loser S1 @ Loser S2</PlaceHolderCard>
          )}
        </ThirdPlace>
        <Final>
          Final
          {finalB ? (
            <GameItem
              game={
                finalB.homeTeam !== "TBD" || finalB.awayTeam !== "TBD"
                  ? genTeamPlaceholder(finalB)
                  : finalB
              }
              handleOpenGame={handleOpenGame}
            />
          ) : (
            <PlaceHolderCard>Winner S1 @ Winner S2</PlaceHolderCard>
          )}
        </Final>
      </PlayoffB>
    </PlayoffContainer>
  );
};
export default Bracket;

const PlayoffContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media (max-width: 768px) {
    gap: 0;
  }
`;
const PlayoffA = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;
const PlayoffB = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;
const SemiFinal = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 32px;
  position: relative;
  @media (max-width: 768px) {
    width: 90%;
    gap: 0;
  }
`;
const SemiFinalItem = styled.div`
  position: relative;
`;
const Final = styled.div`
  position: relative;
  padding: 24px;

  @media (max-width: 768px) {
    width: 90%;
  }
`;
const ThirdPlace = styled.div`
  @media (max-width: 768px) {
    width: 90%;
  }
`;
const PlaceHolderCard = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #42917e;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 90%;
  }
`;
