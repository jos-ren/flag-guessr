import type { GuessRecord } from '@/types';
import styles from './RoundHistory.module.css';

interface Props {
  guesses: GuessRecord[];
}

export default function RoundHistory({ guesses }: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.title}>This round</div>
      {guesses.length === 0 ? (
        <div className={styles.empty}>No flags guessed yet</div>
      ) : (
        <div className={styles.list}>
          {guesses.map(({ country, correct }, i) => (
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
