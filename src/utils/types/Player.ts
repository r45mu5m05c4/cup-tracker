import { Goal, Penalty } from "./Game";
import { Team } from "./Team";

export interface Player {
  savePercent: number;
  id: number;
  name: string;
  gamesPlayed: number;
  position: PlayerPosition;
  jerseyNumber: number;
  teamId: number;
  competitionId: number;
  wins: number;
  saves: number;
  goalsAgainst: number;
}
export interface PlayerMetaData extends Player {
  goals: Goal[];
  assists: Goal[];
  secondaryAssists: Goal[];
  penalties: Penalty[];
  team: Team;
}
export enum PlayerPosition {
  Center = "C",
  Defense = "D",
  LeftWing = "LW",
  RightWing = "RW",
  Goalie = "G",
}
