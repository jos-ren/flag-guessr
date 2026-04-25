import type { Country, GuessRecord } from '@/types';
import FlagCard from '@/components/FlagCard';
import StatCard from '@/components/StatCard';
import RoundHistory from '@/components/RoundHistory';
import styles from './GameOverScreen.module.css';

interface Props {
  finalStreak: number;
  highScore: number;
  isNewHigh: boolean;
  stumpedBy: Country | null;
  guessHistory: GuessRecord[];
  onPlayAgain: () => void;
}

export default function GameOverScreen({
  finalStreak, highScore, isNewHigh, stumpedBy, guessHistory, onPlayAgain,
}: Props) {
  return (
    <div className={`${styles.enter} ${styles.container}`}>

      <div className={styles.labelRow}>
        <span className={styles.label}>
          {stumpedBy ? 'Game Over' : 'Flag Guessr'}
        </span>
      </div>

      {stumpedBy && (
        <div className={styles.stumpedSection}>
          <div className={styles.stumpedHeader}>
            <div className={styles.stumpedName}>{stumpedBy.name}</div>
            <div className={styles.stumpedDot} />
            <div className={styles.stumpedCaption}>stumped you</div>
          </div>
          <FlagCard
            code={stumpedBy.code}
            alt={stumpedBy.name}
            ring="error"
          />
        </div>
      )}

      <div className={styles.statsRow}>
        <StatCard value={finalStreak} label="This run" />
        <StatCard
          value={highScore}
          label={isNewHigh ? '✦ new best' : 'Best ever'}
          highlight={isNewHigh}
        />
      </div>

      <button className={styles.playButton} onClick={onPlayAgain}>
        {stumpedBy ? 'Try Again' : 'Play'}
      </button>

      <RoundHistory guesses={guessHistory} />
    </div>
  );
}
