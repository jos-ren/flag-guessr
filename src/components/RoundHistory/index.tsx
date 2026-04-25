import type { GuessRecord, StatEntry } from '@/types';
import styles from './RoundHistory.module.css';

interface Props {
  guesses?: GuessRecord[];
  entries?: StatEntry[];
  title?: string;
  emptyText?: string;
}

export default function RoundHistory({ guesses, entries, title, emptyText }: Props) {
  const isEmpty = entries ? entries.length === 0 : (guesses?.length ?? 0) === 0;

  return (
    <div className={styles.section}>
      <div className={styles.title}>{title ?? 'This round'}</div>
      {isEmpty ? (
        <div className={styles.empty}>{emptyText ?? 'No flags guessed yet'}</div>
      ) : entries ? (
        <div className={styles.list}>
          {entries.map(({ country, count, correct }) => (
            <div key={country.code} className={styles.item}>
              <img
                src={`https://flagcdn.com/w80/${country.code}.png`}
                alt={country.name}
                className={styles.flag}
              />
              <span className={styles.name}>{country.name}</span>
              <span className={`${styles.indicator}${correct ? ` ${styles.correct}` : ` ${styles.wrong}`}`}>
                {count}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {[...(guesses ?? [])].reverse().map(({ country, correct }, i) => (
            <div key={i} className={styles.item}>
              <img
                src={`https://flagcdn.com/w80/${country.code}.png`}
                alt={country.name}
                className={styles.flag}
              />
              <span className={styles.name}>{country.name}</span>
              <span className={`${styles.indicator}${correct ? ` ${styles.correct}` : ` ${styles.wrong}`}`}>
                {correct ? '✓' : '✗'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
