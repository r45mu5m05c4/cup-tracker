export type Player = {
  _id: string;
  generatedId: string;
  name: string;
  goals: number;
  assists: number;
  points: number;
  penaltyMinutes: number;
  gamesPlayed: number;
  position: PlayerPosition;
  jerseyNumber: number;
  teamName: string;
  competition: string;
  wins?: number;
  saves?: number;
  goalsAgainst?: number;
};

export enum PlayerPosition {
  Center = "C",
  Defense = "D",
  LeftWing = "LW",
  RightWing = "RW",
  Goalie = "G",
}
