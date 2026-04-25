import styles from './StatCard.module.css';

interface Props {
  value: number;
  label: string;
  highlight?: boolean;
}

export default function StatCard({ value, label, highlight }: Props) {
  return (
    <div className={`${styles.card}${highlight ? ` ${styles.cardHighlight}` : ''}`}>
      <div className={`${styles.number}${highlight ? ` ${styles.numberHighlight}` : ''}`}>
        {value}
      </div>
      <div className={`${styles.label}${highlight ? ` ${styles.labelHighlight}` : ''}`}>
        {label}
      </div>
    </div>
  );
}
