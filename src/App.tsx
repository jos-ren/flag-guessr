import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useGameContext } from '@/context';
import Footer from '@/components/Footer';
import { setFlagFavicon, setRandomFlagFavicon } from '@/utils';
import { GAME_MODES } from '@/constants';
import styles from './App.module.css';

const AVAILABLE_MODES = GAME_MODES.filter(m => m.available);

export default function RootLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { game } = useGameContext();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname === '/') {
      setRandomFlagFavicon();
    } else if (game.stumpedBy) {
      setFlagFavicon(game.stumpedBy.code);
    } else if (game.current) {
      setFlagFavicon(game.current.code);
    }
  }, [pathname, game.stumpedBy, game.current]);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <div className={styles.root}>
      <nav className={styles.topBar}>
        <button
          className={styles.logoButton}
          onClick={() => void navigate({ to: '/' })}
        >
          Flag Guessr
        </button>

        <div className={styles.statsWrap} ref={dropdownRef}>
          <button
            className={`${styles.statsButton}${dropdownOpen ? ` ${styles.statsButtonActive}` : ''}`}
            onClick={() => setDropdownOpen(o => !o)}
          >
            Stats
          </button>

          {dropdownOpen && (
            <div className={styles.dropdown}>
              {AVAILABLE_MODES.map(mode => (
                <button
                  key={mode.id}
                  className={styles.dropdownItem}
                  onClick={() => {
                    setDropdownOpen(false);
                    void navigate({ to: '/stats/$modeId', params: { modeId: mode.id } });
                  }}
                >
                  {mode.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className={styles.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
