import type { StatsMap } from './types';

const STATS_KEY = 'fg_country_stats';

export function loadStats(): StatsMap {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) ?? '{}') as StatsMap;
  } catch {
    return {};
  }
}

export function recordAnswer(stats: StatsMap, code: string, correct: boolean): StatsMap {
  const entry = stats[code] ?? { correct: 0, wrong: 0 };
  const updated: StatsMap = {
    ...stats,
    [code]: correct
      ? { ...entry, correct: entry.correct + 1 }
      : { ...entry, wrong: entry.wrong + 1 },
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(updated));
  return updated;
}
