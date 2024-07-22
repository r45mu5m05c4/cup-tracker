import { Team } from "./types/Team";
import { Player } from "./types/Player";
import { Game, Penalty } from "./types/Game";
import { Goal } from "./types/Game";
import { Competition } from "./types/Competition";
import { NewGame } from "../Admin/GameManager/ScheduleGameModal";
import { NewPlayer } from "../Admin/PlayerManager/AddPlayerModal";
import { NewTeam } from "../Admin/TeamManager/AddTeamModal";
import supabase from "./supabase/server";

export const getCompetitions = async () => {
  try {
    const { data, error } = await supabase.from("competition").select("*");

    if (error) {
      console.error("Error fetching competitions:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching competitions:", error);
    throw error;
  }
};

export const updateCompetition = async (competition: Competition) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("competition")
      .update([
        {
          name: competition.name,
          startDate: competition.startDate,
          endDate: competition.endDate,
        },
      ])
      .eq("id", competition.id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating competition:", error);
    throw error;
  }
};
export const getTeams = async (competition: string) => {
  try {
    const { data, error } = await supabase
      .from("team")
      .select("*")
      .eq("competition_id", competition);

    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

export const getPlayers = async (competition: string) => {
  try {
    const { data, error } = await supabase
      .from("player")
      .select("*")
      .eq("competition_id", competition);

    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getGames = async (competitionId: string) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .select("*")
      .eq("competition.id", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding games:", error);
    throw error;
  }
};
export const getGameById = async (gameId: string, competitionId: string) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .select()
      .eq("id", gameId)
      .eq("competition.id", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding game:", error);
    throw error;
  }
};
export const removeGameById = async (gameId: string, competitionId: string) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .delete()
      .eq("id", gameId)
      .eq("competition.id", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error removing game:", error);
    throw error;
  }
};
export const removePlayerById = async (
  playerId: string,
  competitionId: string
) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .delete()
      .eq("id", playerId)
      .eq("competition.id", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error removing player:", error);
    throw error;
  }
};
export const removeTeamById = async (teamId: string, competitionId: string) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("team")
      .delete()
      .eq("id", teamId)
      .eq("competition.id", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error removing team:", error);
    throw error;
  }
};
export const getTeamById = async (teamId: string, competitionId: string) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("team")
      .select()
      .eq("id", teamId)
      .eq("competition.id", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding team:", error);
    throw error;
  }
};

export const updateTeamStats = async (team: Team) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("team")
      .update([
        {
          name: team.name,
          draws: team.draws,
          losses: team.losses,
          overtimeLosses: team.overtimeLosses,
          points: team.points,
          goals: team.goals,
          goalsAgainst: team.goalsAgainst,
          gamesPlayed: team.gamesPlayed,
          group: team.group,
          playoffGroup: team.playoffGroup,
          competition_id: team.competitionId,
          logo: team.logo,
        },
      ])
      .eq("id", team.id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};
export const uploadLogo = async () => {};

export const updateGoalieStatsAfterGame = async (
  goalieId: string,
  wins: number,
  saves: number,
  goalsAgainst: number,
  competition: string
) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .update([
        {
          gamesPlayed: 1,
          wins: wins,
          saves: saves,
          goalsAgainst: goalsAgainst,
        },
      ])
      .eq("id", goalieId)
      .eq("competitionId", competition);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const updatePlayerStats = async (player: Player) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .update([
        {
          name: player.name,
          goals: player.goals,
          assists: player.assists,
          points: player.points,
          penaltyMinutes: player.penaltyMinutes,
          gamesPlayed: player.gamesPlayed,
          position: player.position,
          teamName: player.teamName,
          jerseyNumber: player.jerseyNumber,
          competition: player.competition,
          wins: player.wins,
          saves: player.saves,
          goalsAgainst: player.goalsAgainst,
        },
      ])
      .eq("id", player.id)
      .eq("competitionId", player.competition);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};

export const addTeam = async (team: NewTeam) => {
  try {
    const session = await supabase.auth.getSession();
    console.log(session);
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("team").insert([
      {
        name: team.name,
        draws: team.draws,
        losses: team.losses,
        overtimeLosses: team.overTimeLosses,
        points: team.points,
        goals: team.goals,
        goalsAgainst: team.goalsAgainst,
        gamesPlayed: team.gamesPlayed,
        group: team.group,
        playoffGroup: team.playoffGroup,
        competition_id: team.competition_id,
        logo: team.logo,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding team:", error);
    throw error;
  }
};
export const addPlayer = async (player: NewPlayer) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("player").insert([
      {
        name: player.name,
        goals: player.goals,
        assists: player.assists,
        points: player.points,
        penaltyMinutes: player.penaltyMinutes,
        gamesPlayed: player.gamesPlayed,
        position: player.position,
        teamName: player.teamName,
        jerseyNumber: player.jerseyNumber,
        competition: player.competition,
        wins: player.wins,
        saves: player.saves,
        goalsAgainst: player.goalsAgainst,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding player:", error);
    throw error;
  }
};

export const getPlayerByTeam = async (
  teamName: string,
  competitionId: string
) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .select()
      .eq("teamName", teamName)
      .eq("competitionId", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting player:", error);
    throw error;
  }
};
export const addGame = async (game: NewGame) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("game").insert([
      {
        gameId: game.gameId,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        startTime: game.startTime,
        homeTeamGoals: game.homeTeamGoals,
        awayTeamGoals: game.awayTeamGoals,
        ended: game.ended,
        gameType: game.gameType,
        gameStage: game.gameStage,
        competitionId: game.competition,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

export const updateGame = async (game: Game) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("game").update([
      {
        gameId: game.gameId,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        startTime: game.startTime,
        homeTeamGoals: game.homeTeamGoals,
        awayTeamGoals: game.awayTeamGoals,
        ended: game.ended,
        gameType: game.gameType,
        gameStage: game.gameStage,
        competitionId: game.competition,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

export const addGoal = async (goal: Goal) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("goal").insert([
      {
        gameId: goal.gameId,
        team: goal.scoringTeamId,
        concedingTeam: goal.concedingTeamId,
        scorerId: goal.scorer,
        primaryAssisterId: goal.primaryAssist,
        secondaryAssisterId: goal.secondaryAssist,
        gameMinute: goal.gameMinute,
        competitionId: goal.competitionId,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};
export const addShotToGame = async (game: Game) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .update([
        {
          homeTeamShots: game.homeTeamShots,
          awayTeamShots: game.awayTeamShots,
        },
      ])
      .eq("id", game.id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};
export const addPenalty = async (penalty: Penalty) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("penalty").insert([
      {
        gameId: penalty.gameId,
        teamId: penalty.teamId,
        playerId: penalty.playerId,
        gameMinute: penalty.gameMinute,
        competitionId: penalty.competitionId,
        type: penalty.penaltyType,
        penaltyMinutes: penalty.minutes,
      },
    ]);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};
