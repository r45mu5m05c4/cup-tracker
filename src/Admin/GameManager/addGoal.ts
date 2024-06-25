import { useEffect } from "react";
import { useUser } from "../../utils/context/UserContext";
import {
  addSingularStatToPlayer,
  addSingularStatToTeam,
} from "../../utils/queries";
import { Goal } from "../../utils/types/Goal";

const addGoal = (goal: Goal) => {
  const { user } = useUser();
  const addGoalToPlayer = async () => {
    if (user?.accessToken)
      try {
        const statUpdate = await addSingularStatToPlayer(
          goal.playerId,
          user.accessToken,
          true
        );
        console.log(statUpdate);
      } catch (error) {
        console.error("Error updating player:", error);
      }
  };
  const addAssistToPlayer = async (playerId: string) => {
    if (user?.accessToken)
      try {
        const statUpdate = await addSingularStatToPlayer(
          playerId,
          user.accessToken,
          false
        );
        console.log(statUpdate);
      } catch (error) {
        console.error("Error updating player:", error);
      }
  };
  const addGoalForToTeam = async () => {
    if (user?.accessToken)
      try {
        const statUpdate = await addSingularStatToTeam(
          true,
          goal.scoringTeamId,
          user.accessToken
        );
        console.log(statUpdate);
      } catch (error) {
        console.error("Error updating team:", error);
      }
  };
  const addGoalAgainstToTeam = async () => {
    if (user?.accessToken)
      try {
        const statUpdate = await addSingularStatToTeam(
          true,
          goal.concedingTeamId,
          user.accessToken
        );
        console.log(statUpdate);
      } catch (error) {
        console.error("Error updating team:", error);
      }
  };
  useEffect(() => {
    addGoalToPlayer();
    addAssistToPlayer(goal.assistPlayerId);
    addAssistToPlayer(goal.secondaryAssistPlayerId);
    addGoalForToTeam();
    addGoalAgainstToTeam();
  });
};

export default addGoal;
