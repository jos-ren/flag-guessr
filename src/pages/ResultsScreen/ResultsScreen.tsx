import type { Country, GuessRecord, RunRecord } from '@/types';
import { loadRuns } from '@/stats';
import FlagCard from '@/components/FlagCard';
import ActionButton from '@/components/ActionButton';
import { assetUrl } from '@/utils';
import styles from './ResultsScreen.module.css';

function recapFlagSrc(country: Country): string {
  if (!country.imageUrl && !country.code.includes('-')) {
    return `https://hatscripts.github.io/circle-flags/flags/${country.code.toLowerCase()}.svg`;
  }
  return assetUrl(country.imageUrl ?? `https://flagcdn.com/w80/${country.code}.png`);
}

function formatTime(s: number): string {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function sortRuns(runs: RunRecord[]): RunRecord[] {
  return [...runs].sort((a, b) => b.correctCount - a.correctCount || a.elapsedSeconds - b.elapsedSeconds);
}

interface Props {
  guessHistory: GuessRecord[];
  total: number;
  elapsedSeconds: number;
  isGameOver: boolean;
  modeId: string;
  onPlayAgain: () => void;
  onHome: () => void;
  onLeaderboard: () => void;
}

export default function ResultsScreen({
  guessHistory, total, elapsedSeconds, isGameOver, modeId, onPlayAgain, onHome, onLeaderboard,
}: Props) {
  const correctCount = guessHistory.filter(r => r.correct).length;

  const stumpedBy = isGameOver
    ? ([...guessHistory].reverse().find(r => !r.correct)?.country ?? null)
    : null;

  const runs = loadRuns(modeId);
  const sorted = sortRuns(runs);
  const mostRecent = runs.length > 0 ? [...runs].sort((a, b) => b.timestamp - a.timestamp)[0]! : null;
  const rank = mostRecent ? sorted.findIndex(r => r.id === mostRecent.id) + 1 : null;
  const isNewBest = rank === 1;

  return (
    <div className={`${styles.enter} ${styles.container}`}>

      <div className={styles.hero}>
        <div className={styles.heroScoreRow}>
          <span className={styles.heroScore}>{correctCount}</span>
          <span className={styles.heroTotal}>/ {total}</span>
        </div>
        <div className={styles.heroTime}>{formatTime(elapsedSeconds)}</div>
        <div className={styles.heroBest}>
          {isNewBest
            ? '✦ new best!'
            : rank !== null
              ? `#${rank} on leaderboard`
              : null}
        </div>
      </div>

      {stumpedBy && (
        <div className={styles.stumpedSection}>
          <div className={styles.stumpedTag}>used your last life</div>
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
                  src={recapFlagSrc(country)}
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
