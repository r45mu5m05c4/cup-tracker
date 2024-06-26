import { useUser } from "../../utils/context/UserContext";
import {
  addGoalToGame,
  addPenaltyToGame,
  addPenaltyToPlayer,
} from "../../utils/queries";
import { Goal, Penalty } from "../../utils/types/Game";

export const addGoalToHomeTeamCurrentGame = async (
  gameId: string,
  goal: Goal,
  userAccessToken: string
) => {
  try {
    const statUpdate = await addGoalToGame(gameId, goal, true, userAccessToken);
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating game with home team goal:", error);
  }
};
export const addGoalToAwayTeamCurrentGame = async (
  gameId: string,
  goal: Goal,
  userAccessToken: string
) => {
  try {
    const statUpdate = await addGoalToGame(
      gameId,
      goal,
      false,
      userAccessToken
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating game with away team goal:", error);
  }
};
export const addPenalty = async (
  mins: number,
  generatedId: string,
  userAccessToken: string
) => {
  try {
    const statUpdate = await addPenaltyToPlayer(
      mins,
      generatedId,
      userAccessToken
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
export const addPenaltyToMatch = async (
  gameId: string,
  penalty: Penalty,
  userAccessToken: string
) => {
  try {
    const statUpdate = await addPenaltyToGame(gameId, penalty, userAccessToken);
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
