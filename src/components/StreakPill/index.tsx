import styles from './StreakPill.module.css';

interface Props {
  streak: number;
}

export default function StreakPill({ streak }: Props) {
  const active = streak >= 3;
  return (
    <div className={`${styles.pill}${active ? ` ${styles.pillActive}` : ''}`}>
      <span className={`${styles.text}${active ? ` ${styles.textActive}` : ''}`}>
        {streak} {streak === 1 ? 'correct' : 'in a row'}
      </span>
    </div>
  );
}
