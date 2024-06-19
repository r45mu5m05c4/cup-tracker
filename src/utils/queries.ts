import axios from "axios";
import * as Realm from "realm-web";
import { user as USER } from "./apiKey";
import { Team } from "./types/Team";

const app = new Realm.App({ id: "data-lcjxaso" });

async function loginEmailPassword() {
  const credentials = Realm.Credentials.emailPassword(
    USER.username,
    USER.password
  );
  const user = await app.logIn(credentials);
  console.assert(user.id === app.currentUser?.id);
  return user;
}

export const getTeams = async () => {
  try {
    const user = await loginEmailPassword();

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
        Authorization: `Bearer ${user.accessToken}`,
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

export const getTeamByName = async (teamName: string) => {
  try {
    const user = await loginEmailPassword();

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
        Authorization: `Bearer ${user.accessToken}`,
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

export const updateTeamStats = async (team: Team) => {
  try {
    const user = await loginEmailPassword();
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
        Authorization: `Bearer ${user.accessToken}`,
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
