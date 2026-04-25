export interface CountryStat {
  correct: number;
  wrong: number;
}

export type StatsMap = Record<string, CountryStat>;
