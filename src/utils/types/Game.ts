export interface Goal {
  scorer: string;
  primaryAssist: string;
  secondaryAssist: string;
  team: string;
  gameMinute: number;
}
export interface Game {
  id?: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  homeTeamGoals: Goal[];
  awayTeamGoals: Goal[];
  ended: boolean;
  gameType: GameType;
  gameStage: GameStage;
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