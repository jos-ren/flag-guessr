import { GAME_MODES } from '@/constants';
import GameModeGrid from '@/components/GameModeGrid';
import styles from './HomeScreen.module.css';

interface Props {
  onPlay: (modeId: string) => void;
}

export default function HomeScreen({ onPlay }: Props) {
  return (
    <div className={styles.container}>
      <p className={styles.subtitle}>Choose a game mode to get started</p>
      <GameModeGrid modes={GAME_MODES} onPlay={onPlay} />
    </div>
  );
}
