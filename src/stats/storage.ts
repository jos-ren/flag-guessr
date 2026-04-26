import type { StatsMap } from './types';

export const COUNTRY_STATS_KEY = 'fg_country_stats';
export const STATE_STATS_KEY = 'fg_state_stats';
export const PROVINCE_STATS_KEY = 'fg_province_stats';
export const AFRICA_STATS_KEY = 'fg_africa_stats';
export const NORTH_AMERICA_STATS_KEY = 'fg_north_america_stats';
export const SOUTH_AMERICA_STATS_KEY = 'fg_south_america_stats';
export const ASIA_STATS_KEY = 'fg_asia_stats';
export const EUROPE_STATS_KEY = 'fg_europe_stats';
export const OCEANIA_STATS_KEY = 'fg_oceania_stats';
export const ONE_PIECE_STATS_KEY = 'fg_one_piece_stats';
export const CAPITALS_STATS_KEY = 'fg_capitals_stats';
export const NBA_STATS_KEY = 'fg_nba_stats';
export const NHL_STATS_KEY = 'fg_nhl_stats';
export const MLB_STATS_KEY = 'fg_mlb_stats';
export const NFL_STATS_KEY = 'fg_nfl_stats';

const COMPLETED_KEY = 'fg_quiz_completed';

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

export function resetStats(key: string): void {
  localStorage.removeItem(key);
}

export function markCompleted(statsKey: string): void {
  const existing = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '{}') as Record<string, boolean>;
  existing[statsKey] = true;
  localStorage.setItem(COMPLETED_KEY, JSON.stringify(existing));
}
