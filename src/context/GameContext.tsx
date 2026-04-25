import { createContext, useContext } from 'react';
import { useGame } from '@/hooks/useGame';

type GameContextValue = {
  game: ReturnType<typeof useGame>;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const game = useGame();

  return (
    <GameContext.Provider value={{ game }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
