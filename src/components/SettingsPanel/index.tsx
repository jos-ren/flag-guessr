import { useEffect, useRef } from 'react';
import type { Difficulty, RegionFilter } from '@/types';
import { DIFFICULTY_LABELS, REGION_LABELS } from '@/constants';
import styles from './SettingsPanel.module.css';

interface Props {
  difficulty: Difficulty;
  regionFilter: RegionFilter;
  onDifficultyChange: (d: Difficulty) => void;
  onRegionChange: (r: RegionFilter) => void;
  onClose: () => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard'];
const REGIONS: RegionFilter[] = ['all', 'africa', 'americas', 'asia', 'europe', 'middle-east', 'oceania'];

export default function SettingsPanel({
  difficulty,
  regionFilter,
  onDifficultyChange,
  onRegionChange,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [onClose]);

  return (
    <div className={styles.panel} ref={panelRef}>
      <div className={styles.header}>
        <span className={styles.title}>Settings</span>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close settings">✕</button>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Difficulty</div>
        <div className={styles.buttonGroup}>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`${styles.optionBtn}${difficulty === d ? ` ${styles.optionBtnActive}` : ''}`}
              onClick={() => onDifficultyChange(d)}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Region</div>
        <div className={`${styles.buttonGroup} ${styles.buttonGroupWrap}`}>
          {REGIONS.map(r => (
            <button
              key={r}
              className={`${styles.optionBtn}${regionFilter === r ? ` ${styles.optionBtnActive}` : ''}`}
              onClick={() => onRegionChange(r)}
            >
              {REGION_LABELS[r]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
