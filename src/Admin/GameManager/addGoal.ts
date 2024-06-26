import {
  addSingularStatToPlayer,
  addSingularStatToTeam,
} from "../../utils/queries";
import { Goal } from "../../utils/types/Game";

const addGoal = async (goal: Goal, accessToken: string) => {
  try {
    const statUpdate = await addSingularStatToPlayer(
      goal.scorer,
      accessToken,
      true
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
        false
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
        false
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
      accessToken
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating team:", error);
  }

  try {
    const statUpdate = await addSingularStatToTeam(
      false,
      goal.concedingTeamId,
      accessToken
    );
    console.log(statUpdate);
  } catch (error) {
    console.error("Error updating team:", error);
  }
};

export default addGoal;
