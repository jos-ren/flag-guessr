import type { RunRecord } from '@/types';

const RUNS_KEY_PREFIX = 'fg_runs_';

export function loadRuns(modeId: string): RunRecord[] {
  try {
    return JSON.parse(localStorage.getItem(`${RUNS_KEY_PREFIX}${modeId}`) ?? '[]') as RunRecord[];
  } catch {
    return [];
  }
}

export function saveRun(record: RunRecord): void {
  const existing = loadRuns(record.modeId);
  localStorage.setItem(`${RUNS_KEY_PREFIX}${record.modeId}`, JSON.stringify([...existing, record]));
}
