import type { GameMode, GameModeSection } from '@/types';
import GameModeCard from '@/components/GameModeCard';
import styles from './GameModeGrid.module.css';

const SECTIONS: { id: GameModeSection; label: string }[] = [
  { id: 'world', label: 'World & Continents' },
  { id: 'subdivisions', label: 'States & Provinces' },
  { id: 'sports', label: 'Sports' },
  { id: 'general', label: 'General' },
];

interface Props {
  modes: GameMode[];
  onPlay: (modeId: string) => void;
}

export default function GameModeGrid({ modes, onPlay }: Props) {
  return (
    <div className={styles.sections}>
      {SECTIONS.map(({ id, label }) => {
        const sectionModes = modes.filter(m => m.section === id);
        if (sectionModes.length === 0) return null;
        return (
          <div key={id} className={styles.section}>
            <h2 className={styles.sectionLabel}>{label}</h2>
            <div className={styles.grid}>
              {sectionModes.map(mode => (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  onPlay={() => onPlay(mode.id)}
                  noBorder={id === 'sports'}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
