import type { Country, GuessRecord } from '@/types';
import FlagCard from '@/components/FlagCard';
import StatCard from '@/components/StatCard';
import RoundHistory from '@/components/RoundHistory';
import ActionButton from '@/components/ActionButton';
import styles from './GameOverScreen.module.css';

interface Props {
  finalStreak: number;
  highScore: number;
  isNewHigh: boolean;
  stumpedBy: Country | null;
  guessHistory: GuessRecord[];
  onPlayAgain: () => void;
  onStats: () => void;
}

export default function GameOverScreen({
  finalStreak, highScore, isNewHigh, stumpedBy, guessHistory, onPlayAgain, onStats,
}: Props) {
  return (
    <div className={`${styles.enter} ${styles.container}`}>

      <div className={styles.statsRow}>
        <StatCard value={finalStreak} label="This run" />
        <StatCard
          value={highScore}
          label={isNewHigh ? '✦ new best' : 'Best ever'}
          highlight={isNewHigh}
        />
      </div>

      {stumpedBy && (
        <div className={styles.stumpedSection}>
          <FlagCard
            code={stumpedBy.code}
            alt={stumpedBy.name}
            ring="error"
          />
          <div className={styles.stumpedFooter}>
            <div className={styles.stumpedName}>{stumpedBy.name}</div>
            <div className={styles.stumpedDot} />
            <div className={styles.stumpedCaption}>stumped you</div>
          </div>
        </div>
      )}

      <div className={styles.buttonStack}>
        <ActionButton
          bg="var(--color-accent)"
          color="var(--color-accent-text)"
          glow="var(--color-accent-glow)"
          onClick={onPlayAgain}
        >
          {stumpedBy ? 'Try Again' : 'Play'}
        </ActionButton>
        <ActionButton
          bg="var(--color-btn-bg)"
          color="var(--color-btn-text)"
          border="1.5px solid var(--color-stat-border)"
          onClick={onStats}
        >
          My Progress
        </ActionButton>
      </div>

      <RoundHistory guesses={guessHistory} />
    </div>
  );
}
