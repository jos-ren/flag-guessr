import type { StatsMap } from './types';

export const COUNTRY_STATS_KEY = 'fg_country_stats';
export const STATE_STATS_KEY = 'fg_state_stats';
export const PROVINCE_STATS_KEY = 'fg_province_stats';

export function loadStats(key: string = COUNTRY_STATS_KEY): StatsMap {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '{}') as StatsMap;
  } catch {
    return {};
  }
}

export function recordAnswer(stats: StatsMap, code: string, correct: boolean, key: string = COUNTRY_STATS_KEY): StatsMap {
  const entry = stats[code] ?? { correct: 0, wrong: 0 };
  const updated: StatsMap = {
    ...stats,
    [code]: correct
      ? { ...entry, correct: entry.correct + 1 }
      : { ...entry, wrong: entry.wrong + 1 },
  };
  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}
