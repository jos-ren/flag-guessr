import { useState } from 'react';
import type { Difficulty, RegionFilter } from '@/types';
import { useGame } from '@/hooks/useGame';
import GameScreen from '@/pages/GameScreen';
import GameOverScreen from '@/pages/GameOverScreen';
import SettingsPanel from '@/components/SettingsPanel';
import styles from './AppShell.module.css';

export default function AppShell() {
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const game = useGame(difficulty, regionFilter);

  return (
    <div className={styles.root}>
      {game.isGameOver ? (
        <GameOverScreen
          finalStreak={game.finalStreak}
          highScore={game.highScore}
          isNewHigh={game.isNewHigh}
          stumpedBy={game.stumpedBy}
          guessHistory={game.guessHistory}
          onPlayAgain={game.startGame}
        />
      ) : game.current ? (
        <GameScreen
          current={game.current}
          streak={game.streak}
          options={game.options}
          selected={game.selected}
          animKey={game.animKey}
          imgLoaded={game.imgLoaded}
          isLeaving={game.isLeaving}
          onSelect={game.handleSelect}
          onImgLoad={() => game.setImgLoaded(true)}
        />
      ) : null}

      <button
        className={styles.cogButton}
        onClick={() => setSettingsOpen(o => !o)}
        aria-label="Settings"
      >
        ⚙
      </button>

      {settingsOpen && (
        <SettingsPanel
          difficulty={difficulty}
          regionFilter={regionFilter}
          onDifficultyChange={d => { setDifficulty(d); setSettingsOpen(false); }}
          onRegionChange={r => { setRegionFilter(r); setSettingsOpen(false); }}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}
