export interface Goal {
  scorer: string;
  primaryAssist: string;
  secondaryAssist: string;
  scoringTeamId: string;
  concedingTeamId: string;
  gameMinute: number;
}

export interface Penalty {
  playerId: string;
  playerName: string;
  minutes: number;
  team: string;
  gameMinute: number;
  penaltyType: string;
}
export interface Game {
  _id?: string;
  gameId: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeTeamGoals: Goal[];
  awayTeamGoals: Goal[];
  homeTeamShots: number;
  awayTeamShots: number;
  ended: boolean;
  gameType: GameType;
  gameStage: GameStage;
  penalty: Penalty[];
  competition: string;
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
