import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { RunRecord } from '@/types';
import { loadRuns } from '@/stats';
import { GAME_MODES } from '@/constants';
import List from '@/components/List';
import ActionButton from '@/components/ActionButton';
import styles from './LeaderboardScreen.module.css';

const AVAILABLE_MODES = GAME_MODES.filter(m => m.available);

function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function sortRuns(runs: RunRecord[]): RunRecord[] {
  return [...runs].sort((a, b) => b.correctCount - a.correctCount || a.elapsedSeconds - b.elapsedSeconds);
}

interface Props {
  mode: string;
}

export default function LeaderboardScreen({ mode }: Props) {
  const navigate = useNavigate();

  const runs = useMemo(() => sortRuns(loadRuns(mode)), [mode]);

  const rows = runs.map((run, i) => ({
    id: run.id,
    left: (
      <>
        <span className={styles.rank}>#{i + 1}</span>
        <span className={styles.runName}>{run.name}</span>
      </>
    ),
    right: (
      <>
        <span className={styles.runScore}>{run.correctCount}/{run.total}</span>
        <span className={styles.runTime}>{formatTime(run.elapsedSeconds)}</span>
      </>
    ),
  }));

  return (
    <div className={styles.container}>
      <div className={styles.headingRow}>
        <select
          className={styles.modeSelect}
          value={mode}
          onChange={e => void navigate({ to: '/leaderboard/$modeId', params: { modeId: e.target.value } })}
        >
          {(['world', 'subdivisions', 'sports', 'general'] as const).map(section => {
            const modes = AVAILABLE_MODES.filter(m => m.section === section);
            if (modes.length === 0) return null;
            const label = section.charAt(0).toUpperCase() + section.slice(1);
            return (
              <optgroup key={section} label={label}>
                {modes.map(m => (
                  <option key={m.id} value={m.id}>{m.title}</option>
                ))}
              </optgroup>
            );
          })}
        </select>
      </div>

      <List rows={rows} emptyText="No runs yet — play a game to appear here!" />

      <div className={styles.actions}>
        <ActionButton
          bg="var(--color-accent)"
          color="var(--color-accent-text)"
          glow="var(--color-accent-glow)"
          onClick={() => void navigate({ to: '/play/$modeId', params: { modeId: mode } })}
        >
          Play
        </ActionButton>
        <ActionButton
          bg="var(--color-btn-bg)"
          color="var(--color-btn-text)"
          border="var(--color-btn-border)"
          onClick={() => void navigate({ to: '/' })}
        >
          Home
        </ActionButton>
      </div>
    </div>
  );
}
