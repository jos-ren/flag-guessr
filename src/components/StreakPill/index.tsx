import styles from './StreakPill.module.css';

interface Props {
  streak: number;
  isRecord?: boolean;
}

export default function StreakPill({ streak, isRecord }: Props) {
  const active = streak >= 3;
  return (
    <div className={`${styles.pill}${active ? ` ${styles.pillActive}` : ''}${isRecord ? ` ${styles.pillRecord}` : ''}`}>
      {isRecord && <span className={styles.trophy}>✦</span>}
      <span className={`${styles.text}${active ? ` ${styles.textActive}` : ''}${isRecord ? ` ${styles.textRecord}` : ''}`}>
        {streak} {streak === 1 ? 'correct' : 'in a row'}
      </span>
    </div>
  );
}
