import { Team } from "./types/Team";
import { Player, PlayerMetaData } from "./types/Player";
import { Game, GameMetaData, Penalty } from "./types/Game";
import { Goal } from "./types/Game";
import { Competition } from "./types/Competition";
import { NewGame } from "../Admin/GameManager/ScheduleGameModal";
import { NewPlayer } from "../Admin/PlayerManager/AddPlayerModal";
import { NewTeam } from "../Admin/TeamManager/AddTeamModal";
import supabase from "./supabase/server";
import { TeamMetaData } from "../components/TeamTable/TeamTable";

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
export const getTeams = async (competitionId: number) => {
  try {
    const { data, error } = await supabase
      .from("team")
      .select("*")
      .eq("competitionId", competitionId);

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
export const getTeamsWithMetaData = async (
  competitionId: number
): Promise<TeamMetaData[]> => {
  try {
    const { data, error } = await supabase
      .from("team")
      .select(
        `*,
        goalsFor:goal!goals_teamId_fkey( * ),
        goalsAgainst:goal!goals_concedingTeamId_fkey( * ),
        penalties:penalty!penalty_teamId_fkey( * )`
      )
      .eq("competitionId", competitionId);

    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }

    return data as TeamMetaData[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getPlayers = async (competitionId: number): Promise<Player[]> => {
  try {
    const { data, error } = await supabase
      .from("player")
      .select("*")
      .eq("competitionId", competitionId);

    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }

    return data as Player[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getPlayersWithMetaData = async (
  competitionId: number
): Promise<PlayerMetaData[]> => {
  try {
    const { data, error } = await supabase
      .from("player")
      .select(
        `
        *,
        team:team!players_team_id_fkey ( * ),
        goals:goal!goals_scorerId_fkey( * ),
        assists:goal!goals_primaryAssisterId_fkey( * ),
        secondaryAssists:goal!goals_secondaryAssisterId_fkey( * ),
        penalties:penalty!penalty_playerId_fkey( * )
      `
      )
      .eq("competitionId", competitionId);

    if (error) {
      console.error("Error fetching teams:", error);
      throw error;
    }

    return data as PlayerMetaData[];
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getGames = async (
  competitionId: number
): Promise<GameMetaData[]> => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .select(
        `
        *,
        homeTeam:team!games_homeTeamId_fkey ( * ),
        awayTeam:team!games_awayTeamId_fkey ( * ),
        goals:goal!goals_gameId_fkey( * ),
        penalties:penalty!penalty_gameId_fkey( * )
      `
      )
      .eq("competitionId", competitionId);

    if (error) {
      throw error;
    }

    return data as GameMetaData[];
  } catch (error) {
    console.error("Error finding games:", error);
    throw error;
  }
};
export const getGoalsInGame = async (gameId: number) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("goal")
      .select("*")
      .eq("gameId", gameId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding goals:", error);
    throw error;
  }
};
export const getPenaltiesInGame = async (gameId: number) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("penalty")
      .select("*")
      .eq("competitionId", gameId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding penalties:", error);
    throw error;
  }
};
export const getGameById = async (gameId: number, competitionId: number) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .select()
      .eq("id", gameId)
      .eq("competitionId", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error finding game:", error);
    throw error;
  }
};
export const getGameByIdWithMetaData = async (
  gameId: number,
  competitionId: number
): Promise<GameMetaData> => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .select(
        `
        *,
        homeTeam:team!games_homeTeamId_fkey ( * ),
        awayTeam:team!games_awayTeamId_fkey ( * ),
        goals:goal!goals_gameId_fkey( * ),
        penalty:penalty!penalty_gameId_fkey ( * )
      `
      )
      .eq("id", gameId)
      .eq("competitionId", competitionId)
      .single();

    if (error) {
      throw error;
    }

    return data as GameMetaData;
  } catch (error) {
    console.error("Error finding game:", error);
    throw error;
  }
};
export const removeGameById = async (gameId: number, competitionId: number) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("game")
      .delete()
      .eq("id", gameId)
      .eq("competitionId", competitionId);

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
  playerId: number,
  competitionId: number
) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .delete()
      .eq("id", playerId)
      .eq("competitionId", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error removing player:", error);
    throw error;
  }
};
export const getPlayerByIdWithMetaData = async (
  playerId: number,
  competitionId: number
): Promise<PlayerMetaData> => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .select(
        `
        *,
        team:team!players_teamId_fkey ( * ),
        goals:goal!goals_scorerId_fkey( * ),
        assists:goal!goals_primaryAssisterId_fkey( * ),
        secondaryAssists:goal!goals_secondaryAssisterId_fkey( * ),
        penalties:penalty!penalty_playerId_fkey( * )
      `
      )
      .eq("id", playerId)
      .eq("competitionId", competitionId)
      .single();

    if (error) {
      throw error;
    }

    return data as PlayerMetaData;
  } catch (error) {
    console.error("Error finding game:", error);
    throw error;
  }
};
export const removeTeamById = async (teamId: number, competitionId: number) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("team")
      .delete()
      .eq("id", teamId)
      .eq("competitionId", competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error removing team:", error);
    throw error;
  }
};
export const getTeamById = async (
  teamId: number,
  competitionId: number
): Promise<Team> => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("team")
      .select()
      .eq("id", teamId)
      .eq("competitionId", competitionId)
      .single();

    if (error) {
      throw error;
    }

    return data as Team;
  } catch (error) {
    console.error("Error finding team:", error);
    throw error;
  }
};

export const updateTeamStats = async (team: Team) => {
  try {
    const session = await supabase.auth.getSession();

    if (!session) {
      throw new Error("User is not authenticated");
    }
    const { data, error } = await supabase
      .from("team")
      .update([
        {
          name: team.name,
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          overtimeLosses: team.overtimeLosses,
          group: team.group,
          playoffGroup: team.playoffGroup,
          competitionId: team.competitionId,
          logo: team.logo,
        },
      ])
      .eq("id", team.id)
      .eq("competitionId", team.competitionId);

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
  goalieId: number,
  wins: number,
  saves: number,
  goalsAgainst: number,
  competitionId: number
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
      .eq("competitionId", competitionId);

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
          gamesPlayed: player.gamesPlayed,
          position: player.position,
          teamId: player.teamId,
          jerseyNumber: player.jerseyNumber,
          competitionId: player.competitionId,
          wins: player.wins,
          saves: player.saves,
          goalsAgainst: player.goalsAgainst,
        },
      ])
      .eq("id", player.id)
      .eq("competitionId", player.competitionId);

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

    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase.from("team").insert([
      {
        name: team.name,
        draws: team.draws,
        losses: team.losses,
        overtimeLosses: team.overTimeLosses,
        group: team.group,
        playoffGroup: team.playoffGroup,
        competitionId: team.competitionId,
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
        gamesPlayed: player.gamesPlayed,
        position: player.position,
        teamId: player.teamId,
        jerseyNumber: player.jerseyNumber,
        competitionId: player.competitionId,
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

export const getPlayersByTeam = async (
  teamId: number,
  competitionId: number
) => {
  try {
    const session = await supabase.auth.getSession();
    if (!session) {
      throw new Error("User is not authenticated");
    }

    const { data, error } = await supabase
      .from("player")
      .select()
      .eq("teamId", teamId)
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
        homeTeamId: game.homeTeamId,
        awayTeamId: game.awayTeamId,
        startTime: game.startTime,
        ended: game.ended,
        gameType: game.gameType,
        gameStage: game.gameStage,
        competitionId: game.competitionId,
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

    const { data, error } = await supabase
      .from("game")
      .update([
        {
          homeTeamId: game.homeTeamId,
          awayTeamId: game.awayTeamId,
          startTime: game.startTime,
          ended: game.ended,
          gameType: game.gameType,
          gameStage: game.gameStage,
          competitionId: game.competitionId,
        },
      ])
      .eq("id", game.id)
      .eq("competitionId", game.competitionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating game:", error);
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
        scoringTeamId: goal.scoringTeamId,
        concedingTeamId: goal.concedingTeamId,
        scorerId: goal.scorerId,
        primaryAssisterId: goal.primaryAssisterId,
        secondaryAssisterId: goal.secondaryAssisterId,
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
        penaltyType: penalty.penaltyType,
        penaltyMinutes: penalty.penaltyMinutes,
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
