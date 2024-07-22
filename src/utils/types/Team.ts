export type Team = {
  logo: string | undefined;
  id: string;
  name: string;
  wins: number;
  draws: number;
  losses: number;
  overtimeLosses: number;
  points: number;
  goals: number;
  goalsAgainst: number;
  gamesPlayed: number;
  group: string;
  playoffGroup: string;
  competitionId: string;
};
