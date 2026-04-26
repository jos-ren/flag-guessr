import type { GameMode } from '@/types';
import { assetUrl } from '@/utils';
import styles from './GameModeCard.module.css';

interface Props {
  mode: GameMode;
  onPlay: () => void;
  noBorder?: boolean;
}

export default function GameModeCard({ mode, onPlay, noBorder }: Props) {
  return (
    <button
      className={`${styles.card}${!mode.available ? ` ${styles.cardDisabled}` : ''}`}
      onClick={onPlay}
      disabled={!mode.available}
    >
      <div className={styles.flagWrap}>
        <img
          src={assetUrl(mode.flagImageUrl ?? `https://flagcdn.com/w640/${mode.flagCode}.png`)}
          alt={`${mode.title} preview`}
          className={`${styles.flag}${noBorder ? ` ${styles.flagNoBorder}` : ''}`}
          draggable={false}
          referrerPolicy="no-referrer"
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
