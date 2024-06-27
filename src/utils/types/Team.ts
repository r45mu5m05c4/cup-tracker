export type Team = {
  _id: string;
  name: string;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  logo?: string;
  goals: number;
  goalsAgainst: number;
  gamesPlayed: number;
  group: string;
  playoffGroup: string;
};
