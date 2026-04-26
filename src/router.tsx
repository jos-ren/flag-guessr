import { createRouter, createRoute, createRootRoute, createBrowserHistory, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import RootLayout from './App';
import HomeScreen from '@/pages/HomeScreen';
import GameScreen from '@/pages/GameScreen';
import ResultsScreen from '@/pages/ResultsScreen';
import LeaderboardScreen from '@/pages/LeaderboardScreen';
import { useGameContext } from '@/context';
import type { RunRecord } from '@/types';
import { randomName } from '@/utils';
import { saveRun } from '@/stats';

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function HomeRoute() {
    const navigate = useNavigate();
    return (
      <HomeScreen
        onPlay={(modeId) => { void navigate({ to: '/play/$modeId', params: { modeId } }); }}
      />
    );
  },
});

const playRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/play/$modeId',
  component: function PlayRoute() {
    const { modeId } = playRoute.useParams();
    const navigate = useNavigate();
    const { game } = useGameContext();
    const hasStarted = useRef(false);

    useEffect(() => {
      hasStarted.current = false;
      game.startGame(modeId);
    }, [modeId, game.startGame]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      if (game.phase === 'active') hasStarted.current = true;
    }, [game.phase]);

    useEffect(() => {
      if (!hasStarted.current) return;
      if (game.phase !== 'gameover' && game.phase !== 'quizcomplete') return;
      const correctCount = game.guessHistory.filter(r => r.correct).length;
      const record: RunRecord = {
        id: crypto.randomUUID(),
        name: randomName(),
        modeId: game.currentMode,
        correctCount,
        total: game.pool.length,
        elapsedSeconds: game.elapsedSeconds,
        timestamp: Date.now(),
      };
      saveRun(record);
      void navigate({ to: '/results' });
    }, [game.phase]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!game.current || game.isQuizComplete || game.isGameOver) return null;

    return (
      <GameScreen
        current={game.current}
        streak={game.streak}
        isRecord={false}
        options={game.options}
        selected={game.selected}
        animKey={game.animKey}
        imgLoaded={game.imgLoaded}
        isLeaving={game.isLeaving}
        onSelect={game.handleSelect}
        onImgLoad={() => game.setImgLoaded(true)}
        answerMode={game.answerMode}
        pool={game.pool}
        guessHistory={game.guessHistory}
        lives={game.lives}
        maxLives={game.maxLives}
        elapsedSeconds={game.elapsedSeconds}
        eliminatedOptions={game.eliminatedOptions}
      />
    );
  },
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: function ResultsRoute() {
    const navigate = useNavigate();
    const { game } = useGameContext();

    useEffect(() => {
      if (game.guessHistory.length === 0) void navigate({ to: '/', replace: true });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (game.guessHistory.length === 0) return null;

    return (
      <ResultsScreen
        guessHistory={game.guessHistory}
        total={game.pool.length}
        elapsedSeconds={game.elapsedSeconds}
        isGameOver={game.isGameOver}
        modeId={game.currentMode}
        onPlayAgain={() => {
          void navigate({ to: '/play/$modeId', params: { modeId: game.currentMode } });
        }}
        onHome={() => {
          void navigate({ to: '/' });
        }}
        onLeaderboard={() => {
          void navigate({ to: '/leaderboard/$modeId', params: { modeId: game.currentMode } });
        }}
      />
    );
  },
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard/$modeId',
  component: function LeaderboardRoute() {
    const { modeId } = leaderboardRoute.useParams();
    return <LeaderboardScreen mode={modeId} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, playRoute, resultsRoute, leaderboardRoute]);

export const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  basepath: '/flag-guessr',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
