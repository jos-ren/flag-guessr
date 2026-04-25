import type { StatsMap, CountryStat } from './types';

export function getTopCorrect(stats: StatsMap, n: number): Array<{ code: string } & CountryStat> {
  return Object.entries(stats)
    .filter(([, s]) => s.correct > 0)
    .sort(([, a], [, b]) => b.correct - a.correct)
    .slice(0, n)
    .map(([code, stat]) => ({ code, ...stat }));
}
