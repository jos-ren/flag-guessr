import { createRouter, createRoute, createRootRoute, createBrowserHistory, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import RootLayout from './App';
import HomeScreen from '@/pages/HomeScreen';
import GameScreen from '@/pages/GameScreen';
import GameOverScreen from '@/pages/GameOverScreen';
import StatsScreen from '@/pages/StatsScreen';
import { useGameContext } from '@/context';

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

    if (!game.current) return null;

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
      />
    );
  },
});

const statsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/stats/$modeId',
  component: function StatsRoute() {
    const { modeId } = statsRoute.useParams();
    return <StatsScreen mode={modeId} />;
  },
});

const routeTree = rootRoute.addChildren([indexRoute, playRoute, gameOverRoute, statsRoute]);

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
