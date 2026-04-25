import type { TopCountry } from '@/types';
import styles from './StrengthsList.module.css';

interface Props {
  countries: TopCountry[];
}

export default function StrengthsList({ countries }: Props) {
  if (countries.length < 3) return null;

  return (
    <div className={styles.section}>
      <div className={styles.title}>Your Strengths</div>
      <div className={styles.list}>
        {countries.map(({ code, name, correct, wrong }) => (
          <div key={code} className={styles.item}>
            <img
              src={`https://flagcdn.com/w80/${code}.png`}
              alt={name}
              className={styles.flag}
            />
            <span className={styles.name}>{name}</span>
            <span className={styles.correct}>✓{correct}</span>
            {wrong > 0 && (
              <span className={styles.wrong}>✗{wrong}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
