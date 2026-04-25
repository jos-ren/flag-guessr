import { useGame } from '@/hooks/useGame';
import GameScreen from '@/pages/GameScreen';
import GameOverScreen from '@/pages/GameOverScreen';
import styles from './AppShell.module.css';

export default function AppShell() {
  const game = useGame();

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
    </div>
  );
}
