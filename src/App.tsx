import { useEffect } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useGameContext } from '@/context';
import Footer from '@/components/Footer';
import { setFlagFavicon, setRandomFlagFavicon } from '@/utils';
import styles from './App.module.css';

export default function RootLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { game } = useGameContext();

  useEffect(() => {
    if (pathname === '/') {
      setRandomFlagFavicon();
    } else if (game.stumpedBy) {
      setFlagFavicon(game.stumpedBy.code);
    } else if (game.current) {
      setFlagFavicon(game.current.code);
    }
  }, [pathname, game.stumpedBy, game.current]);

  return (
    <div className={styles.root}>
      <nav className={styles.topBar}>
        <button
          className={styles.logoButton}
          onClick={() => void navigate({ to: '/' })}
        >
          Flag Guessr
        </button>

        <button
          className={styles.leaderboardButton}
          onClick={() => void navigate({ to: '/leaderboard/$modeId', params: { modeId: 'country-flags' } })}
        >
          Leaderboard
        </button>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
