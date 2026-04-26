import { GAME_MODES } from '@/constants';
import GameModeGrid from '@/components/GameModeGrid';
import styles from './HomeScreen.module.css';

interface Props {
  onPlay: (modeId: string) => void;
}

export default function HomeScreen({ onPlay }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>Flag Guessr</h1>
          <p className={styles.heroSub}>How many flags do you know?</p>
          <button className={styles.heroBtn} onClick={() => onPlay('country-flags')}>
            PLAY WORLD FLAGS
          </button>
        </div>
      </div>
      <div className={styles.grid}>
        <GameModeGrid modes={GAME_MODES} onPlay={onPlay} />
      </div>
    </div>
  );
}
