import axios from "axios";
import { Team } from "./types/Team";
import { Player } from "./types/Player";
import { Game, Penalty } from "./types/Game";
import { Goal } from "./types/Game";
import { Competition } from "./types/Competition";
import { NewGame } from "../Admin/ScheduleGame";
import { NewPlayer } from "../Admin/AddPlayer";

export const getCompetitions = async (accessToken: string) => {
  try {
    const data = {
      collection: "competitions",
      database: "folkets-cup",
      dataSource: "folketsCup",
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const updateCompetition = async (
  competition: Competition,
  accessToken: string
) => {
  try {
    const data = {
      collection: "competitions",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { name: competition.name },
      update: {
        $set: {
          name: competition.name,
          startDate: competition.startDate,
          endDate: competition.endDate,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};
export const getTeams = async (accessToken: string, competition: string) => {
  try {
    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { competition: competition },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getAllLogos = async (accessToken: string, competition: string) => {
  try {
    const data = {
      collection: "logos",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { competition: competition },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getPlayers = async (accessToken: string, competition: string) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { competition: competition },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getGames = async (accessToken: string, competition: string) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { competition: competition },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getGameById = async (
  accessToken: string,
  gameId: string,
  competition: string
) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: gameId, competition: competition },
    };
    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/findOne",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    console.log(response);
    return response.data.document;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const removeGameById = async (
  accessToken: string,
  gameId: string,
  competition: string
) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: gameId, competition: competition },
    };
    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/deleteOne",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    console.log(response);
    return response.data.document;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const removePlayerById = async (
  accessToken: string,
  id: string,
  competition: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { generatedId: id, competition: competition },
    };
    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/deleteOne",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    console.log(response);
    return response.data.document;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const getTeamByName = async (
  teamName: string,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { name: teamName, competition: competition },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

export const updateTeamStats = async (team: Team, accessToken: string) => {
  try {
    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { name: team.name, competition: team.competition },
      update: {
        $set: {
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          points: team.points,
          goals: team.goals,
          goalsAgainst: team.goalsAgainst,
          gamesPlayed: team.gamesPlayed,
          group: team.group,
          playoffGroup: team.playoffGroup,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};
export const uploadLogo = async (
  teamName: string,
  logo: Uint8Array,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "logos",
      database: "folkets-cup",
      dataSource: "folketsCup",
      document: {
        teamName: teamName,
        logo: logo,
        competition: competition,
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};
export const updateGoalieStatsAfterGame = async (
  goalieId: string,
  wins: number,
  saves: number,
  goalsAgainst: number,
  competition: string,
  accessToken: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: {
        generatedId: goalieId,
        competition: competition,
      },
      update: {
        $inc: {
          gamesPlayed: 1,
          wins: wins,
          saves: saves,
          goalsAgainst: goalsAgainst,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const updatePlayerStats = async (
  player: Player,
  accessToken: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: {
        generatedId: player.generatedId,
        competition: player.competition,
      },
      update: {
        $set: {
          goals: player.goals,
          assists: player.assists,
          points: player.points,
          penaltyMinutes: player.penaltyMinutes,
          gamesPlayed: player.gamesPlayed,
          position: player.position,
          teamName: player.teamName,
          jerseyNumber: player.jerseyNumber,
          wins: player.wins,
          saves: player.saves,
          goalsAgainst: player.goalsAgainst,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};

export const addPlayer = async (player: NewPlayer, accessToken: string) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      document: {
        generatedId: player.generatedId,
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
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error adding player:", error);
    throw error;
  }
};
export const getPlayerByTeam = async (
  teamName: string,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { teamName: teamName, competition: competition },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/find",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data.documents;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};
export const addGame = async (game: NewGame, accessToken: string) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      document: {
        gameId: game.gameId,
        homeTeam: game.homeTeam,
        awayTeam: game.awayTeam,
        startTime: game.startTime,
        homeTeamGoals: game.homeTeamGoals,
        awayTeamGoals: game.awayTeamGoals,
        ended: game.ended,
        gameType: game.gameType,
        gameStage: game.gameStage,
        competition: game.competition,
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/insertOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error adding game:", error);
    throw error;
  }
};

export const updateGame = async (
  game: Game,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: game.gameId, competition: competition },
      update: {
        $set: {
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          startTime: game.startTime,
          homeTeamGoals: game.homeTeamGoals,
          awayTeamGoals: game.awayTeamGoals,
          homeTeamShots: game.homeTeamShots,
          awayTeamShots: game.awayTeamShots,
          ended: game.ended,
          gameType: game.gameType,
          gameStage: game.gameStage,
          penalty: game.penalty,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const addSingularStatToPlayer = async (
  playerName: string,
  accessToken: string,
  goal: boolean,
  competition: string
) => {
  try {
    const data = goal
      ? {
          collection: "players",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: playerName, competition: competition },
          update: {
            $inc: {
              goals: 1,
              points: 1,
            },
          },
        }
      : {
          collection: "players",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: playerName, competition: competition },
          update: {
            $inc: {
              assists: 1,
              points: 1,
            },
          },
        };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const addPenaltyToPlayer = async (
  pims: number,
  generatedId: string,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { generatedId: generatedId, competition: competition },
      update: {
        $inc: {
          penaltyMinutes: pims,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const addSingularStatToTeam = async (
  goalFor: boolean,
  teamName: string,
  accessToken: string,
  competition: string
) => {
  try {
    const data = goalFor
      ? {
          collection: "teams",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: teamName, competition: competition },
          update: {
            $inc: {
              goals: 1,
            },
          },
        }
      : {
          collection: "teams",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: teamName, competition: competition },
          update: {
            $inc: {
              goalsAgainst: 1,
            },
          },
        };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const addWinOrLossToTeam = async (
  win: boolean,
  teamName: string,
  accessToken: string,
  competition: string,
  overTimeLoss: boolean
) => {
  try {
    let data;
    if (win) {
      data = {
        collection: "teams",
        database: "folkets-cup",
        dataSource: "folketsCup",
        filter: { name: teamName, competition: competition },
        update: {
          $inc: {
            wins: 1,
            points: 3,
            gamesPlayed: 1,
          },
        },
      };
    } else if (overTimeLoss) {
      data = {
        collection: "teams",
        database: "folkets-cup",
        dataSource: "folketsCup",
        filter: { name: teamName, competition: competition },
        update: {
          $inc: {
            overtimeLosses: 1,
            points: 1,
            gamesPlayed: 1,
          },
        },
      };
    } else {
      data = {
        collection: "teams",
        database: "folkets-cup",
        dataSource: "folketsCup",
        filter: { name: teamName, competition: competition },
        update: {
          $inc: {
            losses: 1,
            gamesPlayed: 1,
          },
        },
      };
    }

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const addDrawToTeam = async (
  teamName: string,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { name: teamName, competition: competition },
      update: {
        $inc: {
          draws: 1,
          points: 1,
          gamesPlayed: 1,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
export const addGoalToGame = async (
  gameId: string,
  goal: Goal,
  homeTeam: boolean,
  accessToken: string,
  competition: string
) => {
  try {
    const data = homeTeam
      ? {
          collection: "games",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { gameId: gameId, competition: competition },
          update: {
            $push: {
              homeTeamGoals: goal,
            },
          },
        }
      : {
          collection: "games",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { gameId: gameId, competition: competition },
          update: {
            $push: {
              awayTeamGoals: goal,
            },
          },
        };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};
export const addShotToGame = async (game: Game, accessToken: string) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: game.gameId, competition: game.competition },
      update: {
        $set: {
          homeTeamShots: game.homeTeamShots,
          awayTeamShots: game.awayTeamShots,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};
export const addPenaltyToGame = async (
  gameId: string,
  penalty: Penalty,
  accessToken: string,
  competition: string
) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: gameId, competition: competition },
      update: {
        $push: {
          penalty: penalty,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data),
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Error updating player:", error);
    throw error;
  }
};
