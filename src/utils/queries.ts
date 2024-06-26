import axios from "axios";
import { Team } from "./types/Team";
import { Player } from "./types/Player";
import { NewPlayer } from "../Admin/AddPlayer";
import { NewGame } from "../Admin/ScheduleGame";
import { Game, Penalty } from "./types/Game";
import { Goal } from "./types/Game";

export const getTeams = async (accessToken: string) => {
  try {
    const data = {
      collection: "teams",
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

export const getPlayers = async (accessToken: string) => {
  try {
    const data = {
      collection: "players",
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
export const getGames = async (accessToken: string) => {
  try {
    const data = {
      collection: "games",
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
export const getGameById = async (accessToken: string, gameId: string) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: gameId },
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
export const getTeamByName = async (teamName: string, accessToken: string) => {
  try {
    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { name: teamName },
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
      filter: { name: team.name },
      update: {
        $set: {
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          points: team.points,
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

export const updatePlayerStats = async (
  player: Player,
  accessToken: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { generatedId: player.generatedId },
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
  accessToken: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { teamName: teamName },
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

export const updateGame = async (game: Game, accessToken: string) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: game.gameId },
      update: {
        $set: {
          homeTeam: game.homeTeam,
          awayTeam: game.awayTeam,
          startTime: game.startTime,
          homeTeamGoals: game.homeTeamGoals,
          awayTeamGoals: game.awayTeamGoals,
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
  goal: boolean
) => {
  try {
    const data = goal
      ? {
          collection: "players",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: playerName },
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
          filter: { name: playerName },
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
  accessToken: string
) => {
  try {
    const data = {
      collection: "players",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { generatedId: generatedId },
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
  accessToken: string
) => {
  try {
    const data = goalFor
      ? {
          collection: "teams",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: teamName },
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
          filter: { name: teamName },
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
  accessToken: string
) => {
  try {
    const data = win
      ? {
          collection: "teams",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: teamName },
          update: {
            $inc: {
              wins: 1,
              points: 3,
              gamesPlayed: 1,
            },
          },
        }
      : {
          collection: "teams",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { name: teamName },
          update: {
            $inc: {
              losses: 1,
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
export const addDrawToTeam = async (teamName: string, accessToken: string) => {
  try {
    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { name: teamName },
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
  accessToken: string
) => {
  try {
    const data = homeTeam
      ? {
          collection: "games",
          database: "folkets-cup",
          dataSource: "folketsCup",
          filter: { gameId: gameId },
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
          filter: { gameId: gameId },
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
export const addPenaltyToGame = async (
  gameId: string,
  penalty: Penalty,
  accessToken: string
) => {
  try {
    const data = {
      collection: "games",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { gameId: gameId },
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
