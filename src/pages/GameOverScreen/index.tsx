import type { Country, GuessRecord } from '@/types';
import FlagCard from '@/components/FlagCard';
import ActionButton from '@/components/ActionButton';
import { assetUrl } from '@/utils';
import styles from './GameOverScreen.module.css';

interface Props {
  finalStreak: number;
  highScore: number;
  isNewHigh: boolean;
  stumpedBy: Country | null;
  guessHistory: GuessRecord[];
  onPlayAgain: () => void;
  onHome: () => void;
  onLeaderboard: () => void;
}

export default function GameOverScreen({
  finalStreak, highScore, isNewHigh, stumpedBy, guessHistory, onPlayAgain, onHome, onLeaderboard,
}: Props) {
  return (
    <div className={`${styles.enter} ${styles.container}`}>

      <div className={styles.hero}>
        <div className={styles.heroScore}>{finalStreak}</div>
        <div className={styles.heroLabel}>This run</div>
        <div className={styles.heroBest}>
          {isNewHigh ? '✦ new best!' : `Best ever: ${highScore}`}
        </div>
      </div>

      {stumpedBy && (
        <div className={styles.stumpedSection}>
          <div className={styles.stumpedTag}>ended your streak</div>
          <div className={styles.flagWrap}>
            <FlagCard code={stumpedBy.code} imageUrl={stumpedBy.imageUrl} alt={stumpedBy.name} ring="error" />
          </div>
          <div className={styles.stumpedName}>{stumpedBy.name}</div>
        </div>
      )}

      <div className={styles.buttons}>
        <ActionButton
          bg="var(--color-accent)"
          color="var(--color-accent-text)"
          glow="var(--color-accent-glow)"
          onClick={onPlayAgain}
        >
          Try Again
        </ActionButton>
        <div className={styles.secondaryRow}>
          <ActionButton
            bg="var(--color-btn-bg)"
            color="var(--color-btn-text)"
            border="1.5px solid var(--color-stat-border)"
            onClick={onHome}
          >
            All Games
          </ActionButton>
          <ActionButton
            bg="var(--color-btn-bg)"
            color="var(--color-btn-text)"
            border="1.5px solid var(--color-stat-border)"
            onClick={onLeaderboard}
          >
            Leaderboard
          </ActionButton>
        </div>
      </div>

      <div className={styles.history}>
        <div className={styles.historyTitle}>Recap</div>
        {guessHistory.length === 0 ? (
          <div className={styles.historyEmpty}>No flags guessed yet</div>
        ) : (
          <div className={styles.historyGrid}>
            {[...guessHistory].reverse().map(({ country, correct, selected }, i) => (
              <div key={i} className={styles.historyItem}>
                <img
                  src={assetUrl(country.imageUrl ?? `https://flagcdn.com/w80/${country.code}.png`)}
                  alt={country.name}
                  className={styles.historyFlag}
                />
                <span className={styles.historyName}>{country.name}</span>
                {!correct && selected && (
                  <span className={styles.wrongGuess}>{selected.name}</span>
                )}
                <span className={`${styles.historyIndicator}${correct ? ` ${styles.correct}` : ` ${styles.wrong}`}`}>
                  {correct ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
