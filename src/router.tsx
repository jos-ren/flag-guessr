import { createRouter, createRoute, createRootRoute, createBrowserHistory, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import RootLayout from './App';
import HomeScreen from '@/pages/HomeScreen';
import GameScreen from '@/pages/GameScreen';
import GameOverScreen from '@/pages/GameOverScreen';
import LeaderboardScreen from '@/pages/LeaderboardScreen';
import { useGameContext } from '@/context';
import { markCompleted } from '@/stats';

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
      if (hasStarted.current && game.phase === 'gameover') {
        void navigate({ to: '/game-over' });
      }
    }, [game.phase, navigate]);

    useEffect(() => {
      if (game.phase === 'quizcomplete') {
        markCompleted(game.statsKey);
        void navigate({ to: '/leaderboard/$modeId', params: { modeId: game.currentMode } });
      }
    }, [game.phase, navigate, game.statsKey, game.currentMode]);

    if (!game.current || game.isQuizComplete) return null;

    return (
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
        answerMode={game.answerMode}
        pool={game.pool}
        guessHistory={game.guessHistory}
      />
    );
  },
});

const gameOverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game-over',
  component: function GameOverRoute() {
    const navigate = useNavigate();
    const { game } = useGameContext();

    useEffect(() => {
      if (!game.stumpedBy) void navigate({ to: '/', replace: true });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!game.stumpedBy) return null;

    return (
      <GameOverScreen
        finalStreak={game.finalStreak}
        highScore={game.highScore}
        isNewHigh={game.isNewHigh}
        stumpedBy={game.stumpedBy}
        guessHistory={game.guessHistory}
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

const routeTree = rootRoute.addChildren([indexRoute, playRoute, gameOverRoute, leaderboardRoute]);

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
