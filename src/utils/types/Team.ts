export type Team = {
  logo: string | undefined;
  id: number;
  name: string;
  wins: number;
  draws: number;
  losses: number;
  overtimeLosses: number;
  group: string;
  playoffGroup: string;
  competitionId: number;
};
