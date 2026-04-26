import { useState, useMemo, type CSSProperties } from 'react';
import type { Country } from '@/types';
import { loadStats, resetStats, COUNTRY_STATS_KEY, STATE_STATS_KEY, PROVINCE_STATS_KEY, AFRICA_STATS_KEY, NORTH_AMERICA_STATS_KEY, SOUTH_AMERICA_STATS_KEY, ASIA_STATS_KEY, EUROPE_STATS_KEY, OCEANIA_STATS_KEY, ONE_PIECE_STATS_KEY, NBA_STATS_KEY, NHL_STATS_KEY, MLB_STATS_KEY, NFL_STATS_KEY, CAPITALS_STATS_KEY } from '@/stats';
import { CONTINENTS } from '@/constants';
import { assetUrl } from '@/utils';
import countriesJson from '@/data/countries.json';
import statesJson from '@/data/us-states.json';
import provincesJson from '@/data/canada-provinces.json';
import pirateCrewsJson from '@/data/pirate-crews.json';
import nbaTeamsJson from '@/data/nba-teams.json';
import nhlTeamsJson from '@/data/nhl-teams.json';
import mlbTeamsJson from '@/data/mlb-teams.json';
import nflTeamsJson from '@/data/nfl-teams.json';
import capitalsJson from '@/data/capitals.json';
import styles from './LeaderboardScreen.module.css';

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const CONTINENT_CONFIG: Record<string, { continent: number; statsKey: string }> = {
  'africa-flags': { continent: CONTINENTS.AFRICA, statsKey: AFRICA_STATS_KEY },
  'north-america-flags': { continent: CONTINENTS.NORTH_AMERICA, statsKey: NORTH_AMERICA_STATS_KEY },
  'south-america-flags': { continent: CONTINENTS.SOUTH_AMERICA, statsKey: SOUTH_AMERICA_STATS_KEY },
  'asia-flags': { continent: CONTINENTS.ASIA, statsKey: ASIA_STATS_KEY },
  'europe-flags': { continent: CONTINENTS.EUROPE, statsKey: EUROPE_STATS_KEY },
  'oceania-flags': { continent: CONTINENTS.OCEANIA, statsKey: OCEANIA_STATS_KEY },
};

function getModeItems(mode: string): { items: Country[]; statsKey: string } {
  if (mode === 'us-state-flags') return { items: statesJson as Country[], statsKey: STATE_STATS_KEY };
  if (mode === 'ca-province-flags') return { items: provincesJson as Country[], statsKey: PROVINCE_STATS_KEY };
  if (mode === 'one-piece-flags') return { items: pirateCrewsJson as Country[], statsKey: ONE_PIECE_STATS_KEY };
  if (mode === 'nba-logos') return { items: nbaTeamsJson as Country[], statsKey: NBA_STATS_KEY };
  if (mode === 'nhl-logos') return { items: nhlTeamsJson as Country[], statsKey: NHL_STATS_KEY };
  if (mode === 'mlb-logos') return { items: mlbTeamsJson as Country[], statsKey: MLB_STATS_KEY };
  if (mode === 'nfl-logos') return { items: nflTeamsJson as Country[], statsKey: NFL_STATS_KEY };
  if (mode === 'capital-quiz') return { items: capitalsJson as Country[], statsKey: CAPITALS_STATS_KEY };
  const continentCfg = CONTINENT_CONFIG[mode];
  if (continentCfg) {
    return {
      items: (countriesJson as Country[]).filter(c => c.continent === continentCfg.continent),
      statsKey: continentCfg.statsKey,
    };
  }
  return { items: countriesJson as Country[], statsKey: COUNTRY_STATS_KEY };
}

interface Props {
  mode: string;
}

export default function LeaderboardScreen({ mode }: Props) {
  const { items: allItems, statsKey } = getModeItems(mode);
  const TOTAL = allItems.length;
  const [resetKey, setResetKey] = useState(0);

  const { correctCount, masteredList, wrongList, unseenList } = useMemo(() => {
    const stats = loadStats(statsKey);
    const mastered: Country[] = [];
    const wrong: Country[] = [];
    const unseen: Country[] = [];

    for (const item of allItems) {
      const s = stats[item.code];
      if (!s || s.correct + s.wrong === 0) {
        unseen.push(item);
      } else if (s.correct > 0) {
        mastered.push(item);
      } else {
        wrong.push(item);
      }
    }

    return { correctCount: mastered.length, masteredList: mastered, wrongList: wrong, unseenList: unseen };
  }, [allItems, statsKey, resetKey]);

  const isAllComplete = correctCount === TOTAL;
  const dashOffset = CIRCUMFERENCE * (1 - correctCount / TOTAL);

  function handleReset() {
    resetStats(statsKey);
    setResetKey(k => k + 1);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Leaderboard</h1>

      <div className={styles.ringWrapper}>
        <svg width={180} height={180} viewBox="0 0 180 180" className={styles.ring}>
          <circle cx={90} cy={90} r={RADIUS} className={styles.ringTrack} />
          <circle
            cx={90} cy={90} r={RADIUS}
            className={styles.ringFill}
            strokeDasharray={CIRCUMFERENCE}
            style={{ '--dash-offset': dashOffset } as CSSProperties}
          />
        </svg>
        <div className={styles.ringLabel}>
          <span className={styles.ringCount}>{correctCount}</span>
          <span className={styles.ringTotal}>/ {TOTAL}</span>
          <span className={styles.ringCaption}>identified</span>
        </div>
      </div>

      {isAllComplete && (
        <div className={styles.completeBanner}>
          <span className={styles.completeTitle}>All done!</span>
          <span className={styles.completeSub}>You&rsquo;ve identified every item in this quiz.</span>
          <button className={styles.resetBtn} onClick={handleReset}>Reset Quiz</button>
        </div>
      )}

      {wrongList.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Needs work
            <span className={styles.sectionCount}>{wrongList.length}</span>
          </div>
          <div className={styles.list}>
            {wrongList.map(item => (
              <div key={item.code} className={styles.row}>
                <img
                  src={assetUrl(item.imageUrl ?? `https://flagcdn.com/w80/${item.code}.png`)}
                  alt={item.name}
                  className={styles.flag}
                />
                <span className={styles.countryName}>{item.name}</span>
                <span className={`${styles.indicator} ${styles.indicatorWrong}`}>✗</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {masteredList.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Mastered
            <span className={styles.sectionCount}>{masteredList.length}</span>
          </div>
          <div className={styles.list}>
            {masteredList.map(item => (
              <div key={item.code} className={styles.row}>
                <img
                  src={assetUrl(item.imageUrl ?? `https://flagcdn.com/w80/${item.code}.png`)}
                  alt={item.name}
                  className={styles.flag}
                />
                <span className={styles.countryName}>{item.name}</span>
                <span className={`${styles.indicator} ${styles.indicatorCorrect}`}>✓</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {unseenList.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Unseen
            <span className={styles.sectionCount}>{unseenList.length}</span>
          </div>
          <div className={styles.list}>
            {unseenList.map(item => (
              <div key={item.code} className={`${styles.row} ${styles.rowUnseen}`}>
                <img
                  src={assetUrl(item.imageUrl ?? `https://flagcdn.com/w80/${item.code}.png`)}
                  alt={item.name}
                  className={styles.flag}
                />
                <span className={styles.countryName}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
