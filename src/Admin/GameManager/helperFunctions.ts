import {
  addDrawToTeam,
  addGoalToGame,
  addPenaltyToGame,
  addPenaltyToPlayer,
  addWinOrLossToTeam,
  updateGame,
} from "../../utils/queries";
import { Game, Goal, Penalty } from "../../utils/types/Game";

export const addGoalToHomeTeamCurrentGame = async (
  gameId: string,
  goal: Goal,
  userAccessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addGoalToGame(
      gameId,
      goal,
      true,
      userAccessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating game with home team goal:", error);
  }
};
export const addGoalToAwayTeamCurrentGame = async (
  gameId: string,
  goal: Goal,
  userAccessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addGoalToGame(
      gameId,
      goal,
      false,
      userAccessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating game with away team goal:", error);
  }
};
export const addPenalty = async (
  mins: number,
  generatedId: string,
  userAccessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addPenaltyToPlayer(
      mins,
      generatedId,
      userAccessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
export const addPenaltyToMatch = async (
  gameId: string,
  penalty: Penalty,
  userAccessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addPenaltyToGame(
      gameId,
      penalty,
      userAccessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
export const endMatch = async (game: Game, userAccessToken: string) => {
  try {
    const statUpdate = await updateGame(
      game,
      userAccessToken,
      game.competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
export const giveWin = async (
  teamName: string,
  userAccessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addWinOrLossToTeam(
      true,
      teamName,
      userAccessToken,
      competition,
      false
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
export const giveLoss = async (
  teamName: string,
  userAccessToken: string,
  competition: string,
  overTimeLoss: boolean
) => {
  try {
    const statUpdate = await addWinOrLossToTeam(
      false,
      teamName,
      userAccessToken,
      competition,
      overTimeLoss
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
export const giveDraw = async (
  teamName: string,
  userAccessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addDrawToTeam(
      teamName,
      userAccessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};
