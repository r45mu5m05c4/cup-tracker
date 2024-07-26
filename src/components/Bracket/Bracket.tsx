import { useEffect, useState } from "react";
import { getGames } from "../../utils/queries";
import { GameMetaData } from "../../utils/types/Game";
import { styled } from "styled-components";
import { useCompetition } from "../../utils/context/CompetitionContext";
import { GameModal } from "../Games/GameModal";
import { GameItem } from "../../molecules/GameItem";

export const Bracket = () => {
  const [games, setGames] = useState<GameMetaData[]>();
  const [semisA, setSemisA] = useState<GameMetaData[]>([]);
  const [semisB, setSemisB] = useState<GameMetaData[]>([]);
  const [finalA, setFinalA] = useState<GameMetaData>();
  const [finalB, setFinalB] = useState<GameMetaData>();
  const [thirdPlaceA, setThirdPlaceA] = useState<GameMetaData>();
  const [thirdPlaceB, setThirdPlaceB] = useState<GameMetaData>();
  const [openGame, setOpenGame] = useState<GameMetaData>();
  const [showModal, setShowModal] = useState(false);
  const { competition } = useCompetition();

  useEffect(() => {
    const fetchAllGames = async () => {
      if (competition)
        try {
          const gamesFromAPI = await getGames(competition.id);

          const playoffGames: GameMetaData[] = gamesFromAPI.filter(
            (g: GameMetaData) =>
              g.gameType === "a_playoff" || g.gameType === "b_playoff"
          );
          setGames(playoffGames);
          const poolAGames = playoffGames.filter(
            (g: GameMetaData) => g.gameType === "a_playoff"
          );
          const poolBGames = playoffGames.filter(
            (g: GameMetaData) => g.gameType === "b_playoff"
          );
          const poolASemis = poolAGames.filter(
            (g: GameMetaData) => g.gameStage === "semi"
          );
          setSemisA(poolASemis);
          const poolBSemis = poolBGames.filter(
            (g: GameMetaData) => g.gameStage === "semi"
          );
          setSemisB(poolBSemis);

          const poolAFinal = poolAGames.find(
            (g: GameMetaData) => g.gameStage === "final"
          );
          setFinalA(poolAFinal);
          const poolBFinal = poolBGames.find(
            (g: GameMetaData) => g.gameStage === "final"
          );
          setFinalB(poolBFinal);
          const poolAThirdPlace = poolAGames.find(
            (g: GameMetaData) => g.gameStage === "third_place"
          );
          setThirdPlaceA(poolAThirdPlace);
          const poolBThirdPlace = poolBGames.find(
            (g: GameMetaData) => g.gameStage === "third_place"
          );
          setThirdPlaceB(poolBThirdPlace);
        } catch (error) {
          console.error("Error fetching games:", error);
        }
    };

    fetchAllGames();
  }, []);
  const handleOpenGame = (gameId: number | undefined) => {
    const foundGame = gameId && games?.find((g) => g.id === gameId);
    if (foundGame) {
      setOpenGame(foundGame);
      setShowModal(true);
    }
  };
  const genTeamPlaceholder = (
    game: GameMetaData,
    semi1?: boolean
  ): GameMetaData => {
    if (!game.homeTeamId && semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam.name =
            game.gameType === "a_playoff" ? "Group A 1st" : "Group A 3rd";
          break;
        case "third_place":
          game.homeTeam.name = "Loser S1";
          break;
        case "final":
          game.homeTeam.name = "Winner S1";
          break;
        default:
          game.homeTeam.name = "TBD";
          break;
      }
    }
    if (!game.homeTeamId && !semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam.name =
            game.gameType === "a_playoff" ? "Group B 1st" : "Group B 3rd";
          break;
        case "third_place":
          game.homeTeam.name = "Loser S2";
          break;
        case "final":
          game.homeTeam.name = "Winner S2";
          break;
        default:
          game.homeTeam.name = "TBD";
          break;
      }
    }
    if (!game.awayTeamId && semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam.name =
            game.gameType === "b_playoff" ? "Group A 2nd" : "Group A 4th";
          break;
        case "third_place":
          game.homeTeam.name = "Loser S1";
          break;
        case "final":
          game.homeTeam.name = "Winner S1";
          break;
        default:
          game.homeTeam.name = "TBD";
          break;
      }
    }
    if (!game.awayTeamId && !semi1) {
      switch (game.gameStage) {
        case "semi":
          game.homeTeam.name =
            game.gameType === "b_playoff" ? "Group B 2nd" : "Group B 4th";
          break;
        case "third_place":
          game.homeTeam.name = "Loser S2";
          break;
        case "final":
          game.homeTeam.name = "Winner S2";
          break;
        default:
          game.homeTeam.name = "TBD";
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
            {semisA.map((semi: GameMetaData, i) => (
              <SemiFinalItem key={semi.id}>
                Semi
                <GameItem
                  key={semi.id}
                  game={
                    semi.homeTeam.name || semi.awayTeam.name
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
                thirdPlaceA.homeTeam.name || thirdPlaceA.awayTeam.name
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
                finalA.homeTeam.name || finalA.awayTeam.name
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
            {semisB.map((semi: GameMetaData, i) => (
              <SemiFinalItem key={semi.id}>
                Semi
                <GameItem
                  key={semi.id}
                  game={
                    semi.homeTeam.name || semi.awayTeam.name
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
                thirdPlaceB.homeTeam.name || thirdPlaceB.awayTeam.name
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
                finalB.homeTeam.name || finalB.awayTeam.name
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
  background-color: var(--decorative-brand-light);
  border: 1px solid var(--decorative-brand-light);
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 90%;
  }
`;
