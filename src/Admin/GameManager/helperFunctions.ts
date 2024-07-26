import {
  addGoal,
  addPenalty,
  updateGame,
  updatePlayerStats,
  updateTeamStats,
} from "../../utils/queries";
import { Game, Goal, Penalty } from "../../utils/types/Game";
import { Player } from "../../utils/types/Player";
import { Team } from "../../utils/types/Team";

export const addGoalToGame = async (goal: Goal) => {
  try {
    const statUpdate = await addGoal(goal);
    return statUpdate;
  } catch (error) {
    console.error("Error adding goal:", error);
  }
};

export const addPenaltyToGame = async (penalty: Penalty) => {
  try {
    const statUpdate = await addPenalty(penalty);
    return statUpdate;
  } catch (error) {
    console.error("Error adding penalty:", error);
  }
};

export const endMatch = async (game: Game, players: Player[]) => {
  try {
    await updateGame(game);
    players.map(async (p: Player) => {
      p.gamesPlayed += 1;
      await updatePlayerStats(p);
    });
  } catch (error) {
    console.error("Error ending match:", error);
  }
};
export const undoEndMatch = async (game: Game, players: Player[]) => {
  try {
    await updateGame(game);
    players.map(async (p: Player) => {
      p.gamesPlayed -= 1;
      await updatePlayerStats(p);
    });
  } catch (error) {
    console.error("Error ending match:", error);
  }
};
export const removeWin = async (team: Team) => {
  team.wins -= 1;
  try {
    const statUpdate = await updateTeamStats(team);
    return statUpdate;
  } catch (error) {
    console.error("Error adding win:", error);
  }
};
export const removeLoss = async (team: Team, ot: boolean) => {
  ot
    ? (team.overtimeLosses = team.overtimeLosses - 1)
    : (team.losses = team.losses - 1);
  try {
    const statUpdate = await updateTeamStats(team);
    return statUpdate;
  } catch (error) {
    console.error("Error adding loss:", error);
  }
};
export const removeDraws = async (team1: Team, team2: Team) => {
  team1.draws = team1.draws -= 1;
  team2.draws = team2.draws -= 1;
  try {
    await updateTeamStats(team1);
    await updateTeamStats(team2);
  } catch (error) {
    console.error("Error adding draws:", error);
  }
};
export const giveWin = async (team: Team) => {
  team.wins += 1;
  try {
    const statUpdate = await updateTeamStats(team);
    return statUpdate;
  } catch (error) {
    console.error("Error adding win:", error);
  }
};
export const giveLoss = async (team: Team, ot: boolean) => {
  ot
    ? (team.overtimeLosses = team.overtimeLosses + 1)
    : (team.losses = team.losses + 1);
  try {
    const statUpdate = await updateTeamStats(team);
    return statUpdate;
  } catch (error) {
    console.error("Error adding loss:", error);
  }
};
export const giveDraw = async (team1: Team, team2: Team) => {
  team1.draws = team1.draws += 1;
  team2.draws = team2.draws += 1;
  try {
    await updateTeamStats(team1);
    await updateTeamStats(team2);
  } catch (error) {
    console.error("Error adding draws:", error);
  }
};
