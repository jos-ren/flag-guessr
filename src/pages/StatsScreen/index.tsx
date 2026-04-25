import { useMemo, type CSSProperties } from 'react';
import type { Country } from '@/types';
import { loadStats, COUNTRY_STATS_KEY, STATE_STATS_KEY, PROVINCE_STATS_KEY } from '@/stats';
import countriesJson from '@/data/countries.json';
import statesJson from '@/data/states.json';
import provincesJson from '@/data/provinces.json';
import styles from './StatsScreen.module.css';

const RADIUS = 72;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface StudyEntry {
  country: Country;
  correct: number;
  total: number;
  accuracy: number;
}

function barClass(accuracy: number): string {
  if (accuracy < 0.4) return styles.barLow!;
  if (accuracy < 0.7) return styles.barMid!;
  return styles.barHigh!;
}

interface Props {
  mode: string;
}

export default function StatsScreen({ mode }: Props) {
  const allItems = (
    mode === 'us-state-flags' ? statesJson :
    mode === 'ca-province-flags' ? provincesJson :
    countriesJson
  ) as Country[];
  const statsKey =
    mode === 'us-state-flags' ? STATE_STATS_KEY :
    mode === 'ca-province-flags' ? PROVINCE_STATS_KEY :
    COUNTRY_STATS_KEY;
  const TOTAL = allItems.length;

  const { seenCount, seenList, unseenList } = useMemo(() => {
    const stats = loadStats(statsKey);
    const entries: StudyEntry[] = [];
    const unseen: Country[] = [];

    for (const country of allItems) {
      const s = stats[country.code];
      if (!s || s.correct + s.wrong === 0) {
        unseen.push(country);
        continue;
      }
      const t = s.correct + s.wrong;
      entries.push({ country, correct: s.correct, total: t, accuracy: s.correct / t });
    }

    entries.sort((a, b) =>
      a.accuracy !== b.accuracy
        ? a.accuracy - b.accuracy
        : b.total - a.total
    );

    return { seenCount: entries.length, seenList: entries, unseenList: unseen };
  }, [allItems, statsKey]);

  const dashOffset = CIRCUMFERENCE * (1 - seenCount / TOTAL);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Progress</h1>

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
          <span className={styles.ringCount}>{seenCount}</span>
          <span className={styles.ringTotal}>/ {TOTAL}</span>
          <span className={styles.ringCaption}>flags seen</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Study list</div>
        {seenList.length === 0 ? (
          <div className={styles.empty}>Play some rounds to see your stats here</div>
        ) : (
          <div className={styles.list}>
            {seenList.map(({ country, correct, total, accuracy }) => (
              <div key={country.code} className={styles.row}>
                <img
                  src={country.imageUrl ?? `https://flagcdn.com/w80/${country.code}.png`}
                  alt={country.name}
                  className={styles.flag}
                />
                <div className={styles.rowInfo}>
                  <span className={styles.countryName}>{country.name}</span>
                  <div className={styles.barTrack}>
                    <div
                      className={`${styles.barFill} ${barClass(accuracy)}`}
                      style={{ '--acc': accuracy } as CSSProperties}
                    />
                  </div>
                </div>
                <span className={styles.fraction}>{correct}/{total}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {unseenList.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            Unseen
            <span className={styles.sectionCount}>{unseenList.length}</span>
          </div>
          <div className={styles.list}>
            {unseenList.map(country => (
              <div key={country.code} className={`${styles.row} ${styles.rowUnseen}`}>
                <img
                  src={country.imageUrl ?? `https://flagcdn.com/w80/${country.code}.png`}
                  alt={country.name}
                  className={styles.flag}
                />
                <span className={styles.countryName}>{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
