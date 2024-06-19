import axios from "axios";
import * as Realm from "realm-web";
import { user as USER } from "./apiKey";
import { Team } from "./types/Team";

const app = new Realm.App({ id: "data-lcjxaso" });

async function loginEmailPassword() {
  // Create an email/password credential
  const credentials = Realm.Credentials.emailPassword(
    USER.username,
    USER.password
  );
  // Authenticate the user
  const user = await app.logIn(credentials);
  // 'App.currentUser' updates to match the logged in user
  console.assert(user.id === app.currentUser?.id);
  return user;
}

export const getTeams = async () => {
  try {
    const user = await loginEmailPassword(); // Assuming loginEmailPassword() returns user info with accessToken

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
    return response.data.documents; // Return the documents array from the response
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error; // Rethrow the error to handle it further up
  }
};

export const getTeamByName = async (teamName: string) => {
  try {
    const user = await loginEmailPassword(); // Assuming loginEmailPassword() returns user info with accessToken

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
    return response.data.documents; // Return the documents array from the response
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error; // Rethrow the error to handle it further up
  }
};

export const updateTeamStats = async (team: Team) => {
  try {
    const user = await loginEmailPassword(); // Assuming loginEmailPassword() returns user info with accessToken

    const data = {
      collection: "teams",
      database: "folkets-cup",
      dataSource: "folketsCup",
      filter: { _id: team._id }, // Filter condition to find the team by name
      update: {
        $set: {
          name: team.name,
          wins: team.wins,
          draws: team.draws,
          losses: team.losses,
          points: team.points,
          logo: team.logo,
        },
      },
    };

    const config = {
      method: "post",
      url: "https://eu-central-1.aws.data.mongodb-api.com/app/data-lcjxaso/endpoint/data/v1/action/updateOne",
      headers: {
        "Content-Type": "application/json",
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
