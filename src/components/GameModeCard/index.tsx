import type { GameMode } from '@/types';
import styles from './GameModeCard.module.css';

interface Props {
  mode: GameMode;
  onPlay: () => void;
}

export default function GameModeCard({ mode, onPlay }: Props) {
  return (
    <button
      className={`${styles.card}${!mode.available ? ` ${styles.cardDisabled}` : ''}`}
      onClick={onPlay}
      disabled={!mode.available}
    >
      <div className={styles.flagWrap}>
        <img
          src={mode.flagImageUrl ?? `https://flagcdn.com/w640/${mode.flagCode}.png`}
          alt={`${mode.title} preview`}
          className={styles.flag}
          draggable={false}
        />
        {!mode.available && (
          <span className={styles.badge}>Coming Soon</span>
        )}
      </div>
      <div className={styles.body}>
        <span className={styles.title}>{mode.title}</span>
        <span className={styles.desc}>{mode.description}</span>
      </div>
    </button>
  );
}
