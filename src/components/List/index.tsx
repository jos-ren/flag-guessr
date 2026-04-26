import type { ReactNode } from 'react';
import styles from './List.module.css';

interface ListRow {
  id: string;
  left: ReactNode;
  right: ReactNode;
}

interface Props {
  rows: ListRow[];
  emptyText?: string;
}

export default function List({ rows, emptyText = 'No entries yet' }: Props) {
  if (rows.length === 0) return <div className={styles.empty}>{emptyText}</div>;
  return (
    <div className={styles.list}>
      {rows.map(({ id, left, right }) => (
        <div key={id} className={styles.row}>
          <div className={styles.left}>{left}</div>
          <div className={styles.right}>{right}</div>
        </div>
      ))}
    </div>
  );
}
