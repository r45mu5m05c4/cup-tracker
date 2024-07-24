import { Team } from "./Team";

export interface Goal {
  scorerId: number;
  primaryAssisterId: number | null;
  secondaryAssisterId: number | null;
  scoringTeamId: number;
  concedingTeamId: number;
  gameMinute: number;
  competitionId: number;
  gameId: number;
}

export interface Penalty {
  playerId: number;
  penaltyMinutes: number;
  teamId: number;
  gameMinute: number;
  penaltyType: string;
  competitionId: number;
  gameId: number;
}
export interface Game {
  id: number;
  homeTeamId: number;
  awayTeamId: number;
  startTime: string;
  homeTeamShots: number;
  awayTeamShots: number;
  ended: boolean;
  gameType: GameType;
  gameStage: GameStage;
  competitionId: number;
}
export interface GameMetaData extends Game {
  homeTeam: Team;
  awayTeam: Team;
  goals: Goal[];
  penalties: Penalty[];
}
export enum GameType {
  GroupA = "group_a",
  GroupB = "group_b",
  APlayoff = "a_playoff",
  BPlayoff = "b_playoff",
}
export enum GameStage {
  Group = "group",
  Semi = "semi",
  Final = "final",
  ThirdPlace = "third_place",
}
