import { useEffect, useState } from "react";
import { getGames } from "../../utils/queries";
import { useUser } from "../../utils/context/UserContext";
import { Game } from "../../utils/types/Game";
import { styled } from "styled-components";

const Bracket = () => {
  const [semisA, setSemisA] = useState<Game[]>([]);
  const [semisB, setSemisB] = useState<Game[]>([]);
  const [finalA, setFinalA] = useState<Game>();
  const [finalB, setFinalB] = useState<Game>();
  const [thirdPlaceA, setThirdPlaceA] = useState<Game>();
  const [thirdPlaceB, setThirdPlaceB] = useState<Game>();
  const { user } = useUser();

  useEffect(() => {
    const fetchAllGames = async () => {
      if (user?.accessToken)
        try {
          const gamesFromAPI = await getGames(user.accessToken);
          const playoffGames: Game[] = gamesFromAPI.filter(
            (g: Game) =>
              g.gameType === "a_playoff" || g.gameType === "b_playoff"
          );
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

  return (
    <>
      <PlayoffA>
        {semisA.length > 0 ? (
          semisA.map((semi: Game) => (
            <SemiFinal key={semi.gameId}>
              {semi.awayTeam}@{semi.awayTeam}
            </SemiFinal>
          ))
        ) : (
          <>
            <SemiFinal>TBD @ TBD</SemiFinal>
            <SemiFinal>TBD @ TBD</SemiFinal>
          </>
        )}
        <ThirdPlace>
          {thirdPlaceA
            ? `${thirdPlaceA?.awayTeam}@ ${thirdPlaceA?.awayTeam}`
            : "TBD @ TBD"}
        </ThirdPlace>
        <Final>
          {finalA ? `${finalA?.awayTeam}@ ${finalA?.awayTeam}` : "TBD @ TBD"}
        </Final>
      </PlayoffA>
      <PlayoffB>
        {semisB.length > 0 ? (
          semisB.map((semi: Game) => (
            <SemiFinal key={semi.gameId}>
              {semisB.map((semi: Game) => (
                <SemiFinal key={semi.gameId}></SemiFinal>
              ))}
            </SemiFinal>
          ))
        ) : (
          <>
            <SemiFinal>TBD @ TBD</SemiFinal>
            <SemiFinal>TBD @ TBD</SemiFinal>
          </>
        )}
        <ThirdPlace>
          {thirdPlaceB
            ? `${thirdPlaceB?.awayTeam}@ ${thirdPlaceB?.awayTeam}`
            : "TBD @ TBD"}
        </ThirdPlace>
        <Final>
          {finalB ? `${finalB?.awayTeam}@ ${finalB?.awayTeam}` : "TBD @ TBD"}
        </Final>
      </PlayoffB>
    </>
  );
};
export default Bracket;
const PlayoffA = styled.div`
  display: flex;
  flex-direction: row;
`;
const PlayoffB = styled.div`
  display: flex;
  flex-direction: row;
`;
const SemiFinal = styled.div`
  display: flex;
  flex-direction: column;
`;
const Final = styled.div``;
const ThirdPlace = styled.div``;
