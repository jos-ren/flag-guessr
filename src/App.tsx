import { useState, useEffect } from 'react';
import type { Difficulty, RegionFilter } from '@/types';
import { useGame } from '@/hooks/useGame';
import HomeScreen from '@/pages/HomeScreen';
import GameScreen from '@/pages/GameScreen';
import GameOverScreen from '@/pages/GameOverScreen';
import StatsScreen from '@/pages/StatsScreen';
import SettingsPanel from '@/components/SettingsPanel';
import { setFlagFavicon, setRandomFlagFavicon } from '@/utils';
import styles from './App.module.css';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'playing' | 'stats'>('home');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const game = useGame(difficulty, regionFilter);

  useEffect(() => {
    if (screen === 'home') {
      setRandomFlagFavicon();
    } else if (game.isGameOver && game.stumpedBy) {
      setFlagFavicon(game.stumpedBy.code);
    } else if (game.current) {
      setFlagFavicon(game.current.code);
    }
  }, [screen, game.isGameOver, game.stumpedBy, game.current]);

  function handlePlay() {
    game.startGame();
    setScreen('playing');
  }

  function handleHome() {
    setScreen('home');
  }

  function handleStats() {
    setScreen('stats');
  }

  return (
    <div className={styles.root}>
      <nav className={styles.topBar}>
        <button className={styles.logoButton} onClick={handleHome}>Flag Guessr</button>
      </nav>
      <main className={styles.main}>
      {screen === 'home' ? (
        <HomeScreen onPlay={handlePlay} />
      ) : screen === 'stats' ? (
        <StatsScreen />
      ) : game.isGameOver ? (
        <GameOverScreen
          finalStreak={game.finalStreak}
          highScore={game.highScore}
          isNewHigh={game.isNewHigh}
          stumpedBy={game.stumpedBy}
          guessHistory={game.guessHistory}
          onPlayAgain={game.startGame}
          onStats={handleStats}
        />
      ) : game.current ? (
        <GameScreen
          current={game.current}
          streak={game.streak}
          isRecord={game.streak > game.highScore}
          options={game.options}
          selected={game.selected}
          animKey={game.animKey}
          imgLoaded={game.imgLoaded}
          isLeaving={game.isLeaving}
          onSelect={game.handleSelect}
          onImgLoad={() => game.setImgLoaded(true)}
        />
      ) : null}
      </main>

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
