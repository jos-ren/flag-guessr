import type { GameMode } from '@/types';
import GameModeCard from '@/components/GameModeCard';
import styles from './GameModeGrid.module.css';

interface Props {
  modes: GameMode[];
  onPlay: (modeId: string) => void;
}

export default function GameModeGrid({ modes, onPlay }: Props) {
  return (
    <div className={styles.grid}>
      {modes.map(mode => (
        <GameModeCard
          key={mode.id}
          mode={mode}
          onPlay={() => onPlay(mode.id)}
        />
      ))}
    </div>
  );
}
