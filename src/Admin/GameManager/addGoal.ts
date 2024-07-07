import {
  addSingularStatToPlayer,
  addSingularStatToTeam,
} from "../../utils/queries";
import { Goal } from "../../utils/types/Game";

export const addGoal = async (
  goal: Goal,
  accessToken: string,
  competition: string
) => {
  try {
    const statUpdate = await addSingularStatToPlayer(
      goal.scorer,
      accessToken,
      true,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating player:", error);
  }

  if (goal.primaryAssist) {
    try {
      const statUpdate = await addSingularStatToPlayer(
        goal.primaryAssist,
        accessToken,
        false,
        competition
      );
      console.log(statUpdate);
    } catch (error) {
      console.error("Error updating player:", error);
    }
  }

  if (goal.secondaryAssist) {
    try {
      const statUpdate = await addSingularStatToPlayer(
        goal.secondaryAssist,
        accessToken,
        false,
        competition
      );
      console.log(statUpdate);
    } catch (error) {
      console.error("Error updating player:", error);
    }
  }

  try {
    const statUpdate = await addSingularStatToTeam(
      true,
      goal.scoringTeamId,
      accessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating team:", error);
  }

  try {
    const statUpdate = await addSingularStatToTeam(
      false,
      goal.concedingTeamId,
      accessToken,
      competition
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating team:", error);
  }
};
