import { useUser } from "../../utils/context/UserContext";
import { addGoalToGame, addPenaltyToPlayer } from "../../utils/queries";
import { Goal } from "../../utils/types/Goal";

export const addGoalToHomeTeamCurrentGame = async (goal: Goal) => {
  const { user } = useUser();
  if (user?.accessToken)
    try {
      const statUpdate = await addGoalToGame(goal, true, user.accessToken);
      console.log(statUpdate);
    } catch (error) {
      console.error("Error updating game with home team goal:", error);
    }
};
export const addGoalToAwayTeamCurrentGame = async (goal: Goal) => {
  const { user } = useUser();
  if (user?.accessToken)
    try {
      const statUpdate = await addGoalToGame(goal, false, user.accessToken);
      console.log(statUpdate);
    } catch (error) {
      console.error("Error updating game with away team goal:", error);
    }
};
export const addPenalty = async (mins: number, playerName: string) => {
  const { user } = useUser();
  if (user?.accessToken)
    try {
      const statUpdate = await addPenaltyToPlayer(
        mins,
        playerName,
        user.accessToken
      );
      console.log(statUpdate);
    } catch (error) {
      console.error("Error adding penalty:", error);
    }
};
